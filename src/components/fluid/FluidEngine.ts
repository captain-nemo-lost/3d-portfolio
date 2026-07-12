import * as THREE from 'three';
import { EffectComposer, EffectPass, BloomEffect, VignetteEffect, NoiseEffect, BlendFunction, RenderPass } from 'postprocessing';
import {
  baseVertexShader,
  clearShader,
  velocitySplatShader,
  advectionShader,
  divergenceShader,
  pressureShader,
  gradientSubtractShader,
  displayShader,
} from './FluidShaders';

export function initFluidEngine(canvas: HTMLCanvasElement) {
  // 1. Core WebGL Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    powerPreference: 'high-performance',
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Fluid simulations strictly require floating point precision for velocity/pressure.
  // We force HalfFloatType. If a device doesn't support it, WebGL will handle it internally or fail cleanly.
  const fboType = THREE.HalfFloatType;
  const filterType = THREE.LinearFilter;

  // 2. FBO Setup
  const simRes = Math.min(window.innerWidth, 768);
  const dyeRes = Math.min(window.innerWidth, 1024);
  const aspect = window.innerHeight / window.innerWidth;
  const simWidth = simRes;
  const simHeight = Math.round(simRes * aspect);
  const dyeWidth = dyeRes;
  const dyeHeight = Math.round(dyeRes * aspect);

  const fboOptions: THREE.RenderTargetOptions = {
    type: fboType,
    format: THREE.RGBAFormat,
    minFilter: filterType,
    magFilter: filterType,
    depthBuffer: false,
    stencilBuffer: false,
  };

  class PingPong {
    read: THREE.WebGLRenderTarget;
    write: THREE.WebGLRenderTarget;
    constructor(w: number, h: number) {
      this.read = new THREE.WebGLRenderTarget(w, h, fboOptions);
      this.write = new THREE.WebGLRenderTarget(w, h, fboOptions);
    }
    swap() {
      const temp = this.read;
      this.read = this.write;
      this.write = temp;
    }
  }

  const velocityFBO = new PingPong(simWidth, simHeight);
  const dyeFBO = new PingPong(dyeWidth, dyeHeight);
  const divergenceFBO = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOptions);
  const pressureFBO = new PingPong(simWidth, simHeight);

  // 3. Material Generators
  const createMat = (fragment: string, uniforms: any) =>
    new THREE.ShaderMaterial({
      vertexShader: baseVertexShader,
      fragmentShader: fragment,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

  const advectionMat = createMat(advectionShader, {
    uVelocity: { value: null },
    uSource: { value: null },
    texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
    dt: { value: 0.016 },
    dissipation: { value: 1.0 },
    uTime: { value: 0 },
  });

  const divergenceMat = createMat(divergenceShader, {
    uVelocity: { value: null },
    texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
  });

  const pressureMat = createMat(pressureShader, {
    uPressure: { value: null },
    uDivergence: { value: null },
    texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
  });

  const gradientMat = createMat(gradientSubtractShader, {
    uPressure: { value: null },
    uVelocity: { value: null },
    texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
  });

  const vSplatMat = createMat(velocitySplatShader, {
    uTarget: { value: null },
    aspectRatio: { value: window.innerWidth / window.innerHeight },
    point: { value: new THREE.Vector2() },
    force: { value: new THREE.Vector2() },
    radius: { value: 0.002 },
  });



  const clearMat = createMat(clearShader, {
    uTexture: { value: null },
    value: { value: 0.8 },
  });

  // Scene for rendering passes
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  scene.add(quad);

  const blit = (target: THREE.WebGLRenderTarget | null) => {
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
  };

  // 4. Post-processing Composer
  const composer = new EffectComposer(renderer);
  
  const displayMat = createMat(displayShader, { 
    uTexture: { value: null },
    texelSize: { value: new THREE.Vector2(1 / dyeWidth, 1 / dyeHeight) }
  });
  
  const displayScene = new THREE.Scene();
  const displayQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displayMat);
  displayScene.add(displayQuad);
  
  const renderPass = new RenderPass(displayScene, camera);
  composer.addPass(renderPass);

  // Severely restrained Bloom (only to lift the highest cream whites slightly)
  const bloomEffect = new BloomEffect({
    blendFunction: BlendFunction.SCREEN,
    luminanceThreshold: 0.95, // Very high threshold
    luminanceSmoothing: 0.1,
    intensity: 0.3, // Very low intensity
  });
  
  const vignetteEffect = new VignetteEffect({
    eskil: false,
    offset: 0.1,
    darkness: 1.1,
  });
  
  const noiseEffect = new NoiseEffect({
    blendFunction: BlendFunction.SCREEN,
    premultiply: true,
  });
  noiseEffect.blendMode.opacity.value = 0.015;

  const effectPass = new EffectPass(camera, bloomEffect, noiseEffect, vignetteEffect);
  composer.addPass(effectPass);

  // 5. Spring Physics State
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let velocityX = 0;
  let velocityY = 0;
  
  const stiffness = 0.05;
  const damping = 0.25;

  let lastTime = performance.now();

  const onMouseMove = (e: MouseEvent) => {
    targetX = e.clientX / window.innerWidth;
    targetY = 1.0 - (e.clientY / window.innerHeight);
  };
  window.addEventListener('mousemove', onMouseMove);

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    vSplatMat.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
  };
  window.addEventListener('resize', onResize);

  // 6. Unified Render Loop
  let reqId: number;

  const loop = (time: number) => {
    const dt = Math.min((time - lastTime) / 1000, 0.016);
    lastTime = time;
    const elapsedTime = time / 1000.0;

    // --- A. Physics Step ---
    const forceX = (targetX - currentX) * stiffness;
    const forceY = (targetY - currentY) * stiffness;
    velocityX = (velocityX + forceX) * (1.0 - damping);
    velocityY = (velocityY + forceY) * (1.0 - damping);
    currentX += velocityX;
    currentY += velocityY;

    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // --- B. Ambient FBM Injection (Disabled based on request for black screen) ---
    // quad.material = aSplatMat;
    // aSplatMat.uniforms.uTarget.value = dyeFBO.read.texture;
    // aSplatMat.uniforms.uTime.value = elapsedTime;
    // blit(dyeFBO.write);
    // dyeFBO.swap();

    // --- C. Interactive Velocity and Dye Injection (Cursor follows smoke) ---
    if (speed > 0.0001) {
      // Splat Velocity
      quad.material = vSplatMat;
      vSplatMat.uniforms.uTarget.value = velocityFBO.read.texture;
      vSplatMat.uniforms.point.value.set(currentX, currentY);
      vSplatMat.uniforms.force.value.set(velocityX * 15000, velocityY * 15000); 
      vSplatMat.uniforms.radius.value = 0.002;
      blit(velocityFBO.write);
      velocityFBO.swap();

      // Splat Dye (Cursor draws the smoke)
      // The display shader maps density (r channel) to colors. We just inject density.
      quad.material = vSplatMat;
      vSplatMat.uniforms.uTarget.value = dyeFBO.read.texture;
      // Inject strong density based on speed (up to 1.0)
      const densityInjection = Math.min(speed * 200, 1.0);
      vSplatMat.uniforms.force.value.set(densityInjection, 0.0);
      vSplatMat.uniforms.radius.value = 0.004; // Slightly thicker than velocity
      blit(dyeFBO.write);
      dyeFBO.swap();
    }

    // --- D. Fluid Simulation Passes ---
    // 1. Advect Velocity (Dissipation 0.995 => ~0.3 in dt scale)
    quad.material = advectionMat;
    advectionMat.uniforms.uVelocity.value = velocityFBO.read.texture;
    advectionMat.uniforms.uSource.value = velocityFBO.read.texture;
    advectionMat.uniforms.dt.value = dt;
    advectionMat.uniforms.dissipation.value = 0.3; // Velocity Persistence
    advectionMat.uniforms.uTime.value = elapsedTime;
    advectionMat.uniforms.texelSize.value.set(1 / simWidth, 1 / simHeight);
    blit(velocityFBO.write);
    velocityFBO.swap();

    // 2. Advect Dye (Dissipation increased so smoke disappears over time)
    advectionMat.uniforms.uVelocity.value = velocityFBO.read.texture;
    advectionMat.uniforms.uSource.value = dyeFBO.read.texture;
    advectionMat.uniforms.dissipation.value = 2.0; // High dissipation so it vanishes
    advectionMat.uniforms.texelSize.value.set(1 / dyeWidth, 1 / dyeHeight);
    blit(dyeFBO.write);
    dyeFBO.swap();

    // 3. Divergence
    quad.material = divergenceMat;
    divergenceMat.uniforms.uVelocity.value = velocityFBO.read.texture;
    blit(divergenceFBO);

    // 4. Clear Pressure
    quad.material = clearMat;
    clearMat.uniforms.uTexture.value = pressureFBO.read.texture;
    clearMat.uniforms.value.value = 0.8;
    blit(pressureFBO.write);
    pressureFBO.swap();

    // 5. Pressure (Jacobi iterations - 20 for tight curls)
    quad.material = pressureMat;
    pressureMat.uniforms.uDivergence.value = divergenceFBO.texture;
    for (let i = 0; i < 20; i++) {
      pressureMat.uniforms.uPressure.value = pressureFBO.read.texture;
      blit(pressureFBO.write);
      pressureFBO.swap();
    }

    // 6. Gradient Subtraction
    quad.material = gradientMat;
    gradientMat.uniforms.uPressure.value = pressureFBO.read.texture;
    gradientMat.uniforms.uVelocity.value = velocityFBO.read.texture;
    blit(velocityFBO.write);
    velocityFBO.swap();

    // --- E. Final Post-Processing Render ---
    displayMat.uniforms.uTexture.value = dyeFBO.read.texture;
    renderer.setRenderTarget(null);
    composer.render(dt);

    reqId = requestAnimationFrame(loop);
  };

  reqId = requestAnimationFrame(loop);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(reqId);
    renderer.dispose();
    composer.dispose();
    velocityFBO.read.dispose();
    velocityFBO.write.dispose();
    dyeFBO.read.dispose();
    dyeFBO.write.dispose();
    divergenceFBO.dispose();
    pressureFBO.read.dispose();
    pressureFBO.write.dispose();
  };
}

export const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const clearShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main() {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const snoise = `
// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

export const ambientSplatShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float uTime;
  uniform vec2 texelSize;
  
  ${snoise}

  void main() {
    vec3 base = texture2D(uTarget, vUv).xyz;
    
    // Domain Warped FBM
    vec2 q = vec2(snoise(vUv * 3.0 + uTime * 0.1), snoise(vUv * 3.0 - uTime * 0.1));
    vec2 r = vec2(snoise(vUv * 2.0 + q + uTime * 0.2), snoise(vUv * 2.0 + q - uTime * 0.2));
    float noise = snoise(vUv * 4.0 + r);
    
    // Asymmetric Composition (Inject heavily top-left and top-right, leave center mostly empty)
    float distTL = distance(vUv, vec2(0.2, 0.8));
    float distTR = distance(vUv, vec2(0.85, 0.7));
    float distB = distance(vUv, vec2(0.6, 0.15));
    
    float mask = smoothstep(0.4, 0.1, distTL) + smoothstep(0.35, 0.05, distTR) + smoothstep(0.3, 0.05, distB);
    mask = clamp(mask, 0.0, 1.0);
    
    // Only inject where noise is high and inside the mask
    float injection = smoothstep(0.1, 0.9, noise) * mask * 0.005; 
    
    // Output density (stored in R channel)
    gl_FragColor = vec4(base + vec3(injection), 1.0);
  }
`;

export const velocitySplatShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec2 point;
  uniform vec2 force;
  uniform float radius;
  void main() {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    float dist = dot(p, p);
    float splat = exp(-dist / radius);
    vec2 base = texture2D(uTarget, vUv).xy;
    // Inject rotational force (curl) manually into the velocity field
    vec2 curlForce = vec2(force.y, -force.x) * 0.5 * splat; // Perpendicular force for vortices
    gl_FragColor = vec4(base + force * splat + curlForce, 0.0, 1.0);
  }
`;

export const advectionShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  uniform float uTime;
  
  ${snoise}

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    
    // Nested Turbulence (Internal Motion)
    // Small details that swirl inside the large clouds
    vec2 noiseVelocity = vec2(
      snoise(vUv * 10.0 + uTime * 0.5),
      snoise(vUv * 10.0 - uTime * 0.5 + 43.2)
    ) * 0.002;
    
    vec2 coord = vUv - dt * (velocity + noiseVelocity) * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = max(vec4(0.0), result / decay);
  }
`;

export const divergenceShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const pressureShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float C = texture2D(uPressure, vUv).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const displayShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 texelSize;
  
  // Custom Color Interpolation Palette
  vec3 getPalette(float v) {
    // Deep Violet -> Lavender -> Soft Pink -> Cyan -> Ice Blue -> Mint -> Sage Green -> Olive -> Cream White
    vec3 c0 = vec3(0.1, 0.0, 0.3); // Deep Violet
    vec3 c1 = vec3(0.5, 0.3, 0.7); // Lavender
    vec3 c2 = vec3(1.0, 0.6, 0.8); // Soft Pink
    vec3 c3 = vec3(0.0, 0.8, 0.9); // Cyan
    vec3 c4 = vec3(0.6, 1.0, 0.8); // Mint/Ice Blue
    vec3 c5 = vec3(1.0, 0.9, 0.8); // Cream White
    
    // Smooth blending across the spectrum
    if(v < 0.2) return mix(c0, c1, v * 5.0);
    if(v < 0.4) return mix(c1, c2, (v - 0.2) * 5.0);
    if(v < 0.6) return mix(c2, c3, (v - 0.4) * 5.0);
    if(v < 0.8) return mix(c3, c4, (v - 0.6) * 5.0);
    return mix(c4, c5, (v - 0.8) * 5.0);
  }

  void main() {
    // Current density
    float density = texture2D(uTexture, vUv).r;
    
    // Volumetric Lighting (Normal Approximation)
    // Sample neighbors to compute density gradient (pseudo-normal)
    float R = texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)).r;
    float L = texture2D(uTexture, vUv - vec2(texelSize.x, 0.0)).r;
    float T = texture2D(uTexture, vUv + vec2(0.0, texelSize.y)).r;
    float B = texture2D(uTexture, vUv - vec2(0.0, texelSize.y)).r;
    
    vec3 normal = normalize(vec3(R - L, T - B, 0.1));
    
    // Virtual light source
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    
    // Lambert/Fresnel shading
    float lambert = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    float lightIntensity = lambert * 0.8 + fresnel * 0.5;
    
    // Soft Edge Density Mapping
    float alpha = smoothstep(0.0, 0.4, density) * 0.65; // Reduced max opacity so text remains readable
    
    // Color Mapping based on density + lighting
    vec3 baseColor = getPalette(clamp(density * 1.5, 0.0, 1.0));
    
    // Apply lighting
    // Darken thick regions naturally, highlight edges
    vec3 finalColor = baseColor * (0.5 + lightIntensity * 1.5) * alpha;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

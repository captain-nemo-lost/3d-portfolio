import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural volumetric silhouette generation
const generateHumanoidPoints = (count: number) => {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  let added = 0;

  // Helper to check if a point (x,y,z) is inside an ellipsoid
  const insideEllipsoid = (x: number, y: number, z: number, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number) => {
    return (Math.pow(x - cx, 2) / (rx * rx)) + (Math.pow(y - cy, 2) / (ry * ry)) + (Math.pow(z - cz, 2) / (rz * rz)) <= 1;
  };

  while (added < count) {
    const x = (Math.random() - 0.5) * 4;
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 2;

    let valid = false;
    // Head
    if (insideEllipsoid(x, y, z, 0, 1.8, 0, 0.4, 0.5, 0.4)) valid = true;
    // Torso
    else if (insideEllipsoid(x, y, z, 0, 0.5, 0, 0.7, 1.0, 0.5)) valid = true;
    // Left Arm
    else if (insideEllipsoid(x, y, z, -0.9, 0.3, 0, 0.25, 0.8, 0.25)) valid = true;
    // Right Arm
    else if (insideEllipsoid(x, y, z, 0.9, 0.3, 0, 0.25, 0.8, 0.25)) valid = true;
    // Left Leg
    else if (insideEllipsoid(x, y, z, -0.35, -1.2, 0, 0.3, 1.0, 0.3)) valid = true;
    // Right Leg
    else if (insideEllipsoid(x, y, z, 0.35, -1.2, 0, 0.3, 1.0, 0.3)) valid = true;

    if (valid) {
      // Add some noise displacement so it's not a perfect smooth geometric shape
      positions[added * 3] = x + (Math.random() - 0.5) * 0.15;
      positions[added * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
      positions[added * 3 + 2] = z + (Math.random() - 0.5) * 0.15;
      scales[added] = Math.random() * 0.5 + 0.5;
      added++;
    }
  }

  return { positions, scales };
};

// Custom Shader for the Centerpiece to animate points (GPU based "breathing" and turbulence)
const centerpieceVertexShader = `
  uniform float uTime;
  attribute float scale;
  
  void main() {
    vec3 pos = position;
    
    // Slow breathing / organic floating
    pos.x += sin(uTime * 0.5 + pos.y * 2.0) * 0.05;
    pos.y += cos(uTime * 0.4 + pos.x * 2.0) * 0.05;
    pos.z += sin(uTime * 0.3 + pos.z * 2.0) * 0.05;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Particle size attenuation
    gl_PointSize = scale * (20.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const centerpieceFragmentShader = `
  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft glow core
    float alpha = smoothstep(0.5, 0.1, dist) * 0.6;
    
    // Soft grey/ash color with a hint of purple
    vec3 color = vec3(0.7, 0.65, 0.8);
    gl_FragColor = vec4(color, alpha);
  }
`;

export const ParticleCenterpiece: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Responsive particle count based on device capability
  const particleCount = isMobile ? 8000 : 25000;

  const { positions, scales } = useMemo(() => generateHumanoidPoints(particleCount), [particleCount]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Very slow rotation of the entire figure
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group position={[0, -0.5, -5]}> {/* Position slightly behind Home Z=0 */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={centerpieceVertexShader}
          fragmentShader={centerpieceFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

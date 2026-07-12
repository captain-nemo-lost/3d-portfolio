import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { initFluidEngine } from './fluid/FluidEngine';

// R3F Component for Dust and Embers
const ParticleSystem: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Points>(null);

  const particleCount = 2000;
  const emberCount = 500;

  // Dust particles
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      sca[i] = Math.random() * 0.5 + 0.5;
    }
    return [pos, sca];
  }, [particleCount]);

  // Fire Embers
  const [emberPositions, emberScales, emberColors] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const sca = new Float32Array(emberCount);
    const col = new Float32Array(emberCount * 3);
    const color = new THREE.Color();
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8; 
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 - 4; // Start lower
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5; 
      sca[i] = Math.random() * 1.5 + 0.5;
      
      // Interpolate between deep orange and bright yellow
      color.setHSL(Math.random() * 0.05 + 0.02, 1.0, Math.random() * 0.5 + 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, sca, col];
  }, [emberCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
    if (emberRef.current) {
      const positions = emberRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<emberCount; i++) {
        // Embers rise upward and drift slightly
        positions[i*3 + 1] += delta * (Math.random() * 0.5 + 0.5); // Y velocity
        positions[i*3] += Math.sin(state.clock.elapsedTime * 2 + i) * delta * 0.2; // X drift
        
        // Reset if they go too high
        if(positions[i*3 + 1] > 5) {
          positions[i*3 + 1] = -5;
          positions[i*3] = (Math.random() - 0.5) * 8;
        }
      }
      emberRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Ambient Dust */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.02} 
          color="#88aaff" 
          transparent 
          opacity={0.4} 
          sizeAttenuation={true} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Fire Embers */}
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[emberColors, 3]} />
          <bufferAttribute attach="attributes-scale" args={[emberScales, 1]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          vertexColors 
          transparent 
          opacity={0.8} 
          sizeAttenuation={true} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

export const PreviewTone: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initFluidEngine(canvasRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* 1. Fluid Background (Raw Canvas) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0" 
      />
      
      {/* 2. R3F Foreground (Particles) */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true, antialias: false }} // Alpha true allows seeing the fluid behind
        >
          <ParticleSystem />
        </Canvas>
      </div>

      {/* 3. Overlay UI purely for context */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-white text-6xl font-bold tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
          Visual Tone Preview
        </h1>
        <p className="text-gray-300 mt-4 tracking-widest text-sm uppercase opacity-90 drop-shadow-[0_0_8px_rgba(0,0,0,1)]">
          Fluid Engine + Ambient Dust + Fire Embers
        </p>
      </div>
    </div>
  );
};

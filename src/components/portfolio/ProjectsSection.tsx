import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, useTexture, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { resumeData } from '../../data/resume';

// Global state to synchronize time and pause state across all cards without React re-renders
const carouselState = {
  time: 0,
  isPaused: false
};

// Single Diagonal Line Cascade (Bottom-Left to Top-Right)
const ProjectPanel: React.FC<{ index: number; total: number; project: any }> = ({ index, total, project }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load the project image
  const texture = useTexture(project.image || '/about-photo.png');

  // Array of materials to create a realistic physical book
  // The right edge acts as the "pages" (white/off-white), front is the cover
  const materials = useMemo(() => {
    const pagesColor = '#f4f4f0'; // Realistic page color
    const spineColor = '#111111';
    const frontColor = hovered ? '#ffffff' : '#cccccc';
    return [
      new THREE.MeshBasicMaterial({ color: pagesColor }), // right (pages exposed to camera)
      new THREE.MeshBasicMaterial({ color: spineColor }), // left (spine)
      new THREE.MeshBasicMaterial({ color: pagesColor }), // top (pages)
      new THREE.MeshBasicMaterial({ color: pagesColor }), // bottom (pages)
      new THREE.MeshBasicMaterial({ map: texture as THREE.Texture, color: frontColor }), // front
      new THREE.MeshBasicMaterial({ color: spineColor }), // back
    ];
  }, [hovered, texture]);

  // Smooth physics and infinite revolving animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerpSpeed = 8 * delta;
    
    // Virtual index flows backwards to move items leftwards
    let virtualIndex = (index - carouselState.time) % total;
    if (virtualIndex < 0) virtualIndex += total; // wrap cleanly
    
    // Map to a V-shape distribution from -12.5 to +12.5
    const dist = virtualIndex - (total / 2);
    
    // Massive, page-filling Library Stack
    const xOffset = dist * 1.3; 
    // Shallower V-shape depth (-0.7 instead of -1.2) so they don't shrink away as much
    const zOffset = -Math.abs(dist) * 0.7; 
    const yOffset = -0.2 - Math.abs(dist) * 0.02; // Flatter vertical arc
    const baseYRot = -0.3; // All face slightly left to show right pages

    // Hover interaction: Pop out significantly to clear the overlapping neighbors
    const targetX = xOffset;
    const targetY = hovered ? yOffset + 0.3 : yOffset;
    const targetZ = hovered ? zOffset + 2.5 : zOffset; 
    const targetYRot = hovered ? 0 : baseYRot;
    
    // Significantly reduced edge fade so books stay large on the sides
    const edgeFade = Math.max(0.7, 1.0 - (Math.abs(dist) * 0.02));
    const targetScale = hovered ? 1.1 : edgeFade;

    // If the book wrapped around the edges, teleport it instantly instead of lerping across screen
    if (Math.abs(groupRef.current.position.x - targetX) > 18.0) {
      groupRef.current.position.x = targetX;
      groupRef.current.position.z = targetZ;
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpSpeed);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpSpeed);
    }
    
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, lerpSpeed);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYRot, lerpSpeed);
    
    // Safe scaling fallback if uninitialized
    if (groupRef.current.scale.x === 0) groupRef.current.scale.setScalar(1);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpSpeed));
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group 
      ref={groupRef}
      position={[0, 0, 0]} 
      rotation={[0, -0.3, 0]}
    >
      <mesh 
        material={materials}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered(true); 
          carouselState.isPaused = true;
        }}
        onPointerOut={() => { 
          setHovered(false); 
          carouselState.isPaused = false;
        }}
        onClick={(e) => {
          e.stopPropagation();
          // Dispatch a custom event to open the modal OUTSIDE the WebGL canvas
          window.dispatchEvent(new CustomEvent('openProjectModal', { detail: project }));
        }}
      >
        {/* Massive Book Geometry filling the screen */}
        <boxGeometry args={[2.1, 3.3, 0.35]} />
      </mesh>
      {/* Glow outline on hover wrapping the whole book */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.1, 3.3, 0.35)]} />
        <lineBasicMaterial attach="material" color={hovered ? "#ffffff" : "#333333"} linewidth={2} />
      </lineSegments>
    </group>
  );
};

export const ProjectsSection: React.FC = () => {
  const { viewport } = useThree();
  const textRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<THREE.Group>(null);
  const carouselGroupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Create 25 dense books to guarantee the entire screen is covered edge-to-edge
  const projects = [
    ...resumeData.projects, ...resumeData.projects, ...resumeData.projects, 
    ...resumeData.projects, ...resumeData.projects
  ];

  // Global time loop to drive the carousel revolution seamlessly
  useFrame((_, delta) => {
    if (!carouselState.isPaused) {
      // Advance global time smoothly
      carouselState.time += delta * 0.4;
    }
  });

  useFrame(() => {
    if (!scroll) return;
    const off = scroll.offset; 
    
    // Mouse parallax removed to keep the V-shape perfectly centered as requested
    
    // 1. Projects Text Animation
    if (textRef.current) {
      textRef.current.visible = off > 0.60; // Guaranteed zero peeking before its turn.
      
      if (off < 0.61) {
        textRef.current.position.y = -viewport.height * 5.0; // hidden below
      } else if (off < 0.65) {
        // Phase 1: Slide up from below (0.61 -> 0.65)
        const p = (off - 0.61) / 0.04; 
        textRef.current.position.y = -viewport.height * 5.0 + (p * viewport.height * 5.0);
      } else if (off <= 0.68) {
        // Phase 2 & 3: Lock in place at center while waiting for cards
        textRef.current.position.y = 0; 
      } else {
        // Phase 4: Scroll away upwards together with cards
        const p = (off - 0.68) / 0.04;
        textRef.current.position.y = p * viewport.height * 1.5;
      }
    }

    // 2. Cards Animation
    if (cardsRef.current) {
      if (off < 0.64) {
        // Phase 1 & 2: Stay hidden (deliberate delay)
        cardsRef.current.position.y = -viewport.height * 2.5;
      } else if (off <= 0.67) {
        // Phase 3: Slide up into the lower position (0.64 -> 0.67)
        const p = (off - 0.64) / 0.03; 
        cardsRef.current.position.y = -viewport.height * 1.5 + (p * viewport.height * 1.2); // ends at -0.3vh
      } else if (off <= 0.68) {
        // Phase 3.5: Lock in place
        cardsRef.current.position.y = -viewport.height * 0.3;
      } else {
        // Phase 4: Scroll away upwards perfectly synced with the text
        const p = (off - 0.68) / 0.04;
        cardsRef.current.position.y = -viewport.height * 0.3 + (p * viewport.height * 1.5);
      }
    }
  });

  return (
    <group>
      
      {/* 1. Projects Title (Massive 3D Ghost Text) */}
      <group ref={textRef} position={[0, -viewport.height * 1.2, 0]}>
        {/* Positioned centered above the row */}
        <Text
          position={[0, viewport.height * 1.0, -10]}
          fontSize={viewport.width > 5 ? 3 : 1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          PROJECTS
        </Text>
      </group>

      {/* 2. 3D Diagonal Cascade Row */}
      <group ref={cardsRef} position={[0, -viewport.height * 2.5, 0]}>
        
        {/* Single Diagonal Line Group */}
        <group ref={carouselGroupRef} position={[0, -0.2, -2]}>
          {projects.map((project, i) => (
            <ProjectPanel 
              key={i} 
              index={i} 
              total={projects.length} 
              project={project} 
            />
          ))}
        </group>

      </group>
    </group>
  );
};

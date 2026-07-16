import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

export const SkillsSection = () => {
  const scroll = useScroll();
  const { viewport } = useThree();
  const textRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!scroll) return;
    const off = scroll.offset;
    
    // Skills 3D Text Animation
    if (textRef.current) {
      if (off < 0.62) {
        textRef.current.position.y = -viewport.height * 2.0;
      } else if (off < 0.66) {
        const p = (off - 0.62) / 0.04; 
        const easeOut = 1 - Math.pow(1 - p, 3);
        textRef.current.position.y = (viewport.height * 1.0) - (1 - easeOut) * (viewport.height * 1.5);
      } else if (off <= 0.74) {
        // Locked in place above the skills cards
        textRef.current.position.y = viewport.height * 1.0;
      } else {
        const p = (off - 0.74) / 0.05;
        textRef.current.position.y = viewport.height * 1.0 + (p * viewport.height * 1.5);
      }
    }
  });

  return (
    <group>
      {/* SKILLS Title */}
      <group ref={textRef}>
        <Text
          position={[0, 0, -10]}
          fontSize={viewport.width > 5 ? 3 : 1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.3}
        >
          SKILLS
        </Text>
      </group>
    </group>
  );
};

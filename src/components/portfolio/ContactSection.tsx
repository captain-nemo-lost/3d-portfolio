import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

export const ContactSection = () => {
  const scroll = useScroll();
  const { viewport } = useThree();
  const textRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!scroll) return;
    const off = scroll.offset;
    
    // Contact 3D Text Animation
    if (textRef.current) {
      if (off < 0.76) {
        textRef.current.position.y = -viewport.height * 2.0;
      } else if (off < 0.84) {
        const p = (off - 0.76) / 0.08; 
        const easeOut = 1 - Math.pow(1 - p, 3);
        textRef.current.position.y = (viewport.height * 1.2) - (1 - easeOut) * (viewport.height * 2.0);
      } else {
        textRef.current.position.y = viewport.height * 1.2;
      }
    }
  });

  return (
    <group>
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
          CONTACT
        </Text>
      </group>
    </group>
  );
};

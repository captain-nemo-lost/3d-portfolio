import React, { useRef } from 'react';

import * as THREE from 'three';

export const CameraRig: React.FC = () => {
  const mouse = useRef(new THREE.Vector2(0, 0));

  // Listen to mouse movement for parallax
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  return null; // This will just hold global camera logic if needed, but ScrollControls might be better wrapped.
};

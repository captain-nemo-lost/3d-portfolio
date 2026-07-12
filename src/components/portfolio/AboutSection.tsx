import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useScroll, useTexture, Edges } from '@react-three/drei';
import { resumeData } from '../../data/resume';

export const ProfileSection: React.FC = () => {
  const { viewport } = useThree();
  const scroll = useScroll();
  
  const textRef = useRef<THREE.Group>(null);
  const expTextRef = useRef<THREE.Group>(null);
  const idCardRef = useRef<THREE.Group>(null);
  
  // Spring state for ID Card
  const idCardSpring = useRef({ 
    y: 0, 
    x: 0,
    rotZ: 0,
    rotY: 0,
    velocityY: 0,
    velocityX: 0,
    velocityRotZ: 0 
  });

  // Assume an image exists at this path (the user mentioned they have one)
  const profileTex = useTexture('/about-photo.png');

  useFrame((state, delta) => {
    if (!scroll) return;
    const off = scroll.offset; // 0.0 to 1.0 (7 pages total)
    
    // 1. About Text Animation (0.08 -> 0.13 enter, 0.34 -> 0.43 exit)
    if (textRef.current) {
      if (off < 0.08) {
        textRef.current.position.y = -viewport.height * 5.0;
      } else if (off < 0.13) {
        // Slide up
        const p = (off - 0.08) / 0.05;
        textRef.current.position.y = -viewport.height * 5.0 + (p * viewport.height * 5.0);
      } else if (off <= 0.34) {
        // Fixed
        textRef.current.position.y = 0;
      } else if (off <= 0.43) {
        // Scroll away up
        const p = (off - 0.34) / 0.09;
        textRef.current.position.y = p * viewport.height * 1.5;
      } else {
        textRef.current.position.y = viewport.height * 5.0; // keep hidden
      }
    }

    // 2. Experience Text Animation (0.38 -> 0.43 enter, 0.55 -> 0.64 exit)
    if (expTextRef.current) {
      if (off < 0.38) {
        expTextRef.current.position.y = viewport.height * 2.0;
      } else if (off <= 0.43) {
        const p = (off - 0.38) / 0.05;
        const easeOut = 1 - Math.pow(1 - p, 3);
        // Start at 1.5, drop down to 1.1 (a difference of 0.4)
        expTextRef.current.position.y = viewport.height * 1.5 - (easeOut * viewport.height * 0.4);
      } else if (off <= 0.55) {
        expTextRef.current.position.y = viewport.height * 1.1; // Shifted higher up
      } else if (off <= 0.64) {
        const p = (off - 0.55) / 0.09;
        expTextRef.current.position.y = viewport.height * 1.1 + (p * viewport.height * 1.5);
      } else {
        expTextRef.current.position.y = viewport.height * 2.0;
      }
    }



    // 3. ID Card Spring Animation (0.21 -> 0.64)
    if (idCardRef.current) {
      let targetY = viewport.height * 2; 
      let targetX = viewport.width > 5 ? -viewport.width * 0.32 : 0;
      let targetRotZ = -0.05;

      if (off >= 0.21 && off <= 0.34) {
        // Phase 1: About Section Anchor
        targetY = -viewport.height * 0.15; 
      } else if (off > 0.34 && off <= 0.55) {
        // Phase 2: Glide to Center for Experience Section
        targetY = 0;
        targetX = 0; 
        targetRotZ = 0;
      } else if (off > 0.55 && off <= 0.64) {
        // Phase 3: Scroll up and exit
        const p = (off - 0.55) / 0.09;
        targetY = p * viewport.height * 1.5;
        targetX = 0;
        targetRotZ = 0;
      } else if (off > 0.64) {
        targetY = viewport.height * 2;
        targetX = 0;
      }

      const dt = Math.min(delta, 1/30);
      const timeScale = dt * 60;
      const stiffness = 0.08 * timeScale; 
      const damping = Math.pow(0.85, timeScale);

      if (off > 0.55) {
         // Rigid lock to scroll out smoothly without bounce
         idCardSpring.current.y = targetY;
         idCardSpring.current.x = targetX;
         idCardSpring.current.rotZ = targetRotZ;
         idCardSpring.current.rotY = 0;
         idCardSpring.current.velocityY = 0;
         idCardSpring.current.velocityX = 0;
         idCardSpring.current.velocityRotZ = 0;
      } else if (off > 0.34 && off <= 0.43) {
         // SCROLL-DRIVEN TRANSITION PHASE (Override physics)
         // Matches exactly with HTML bio scrolling away
         const p = (off - 0.34) / 0.09;
         const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
         
         const startX = viewport.width > 5 ? -viewport.width * 0.32 : 0;
         const startY = -viewport.height * 0.15;
         
         idCardSpring.current.x = startX + (0 - startX) * ease;
         idCardSpring.current.y = startY + (0 - startY) * ease;
         idCardSpring.current.rotZ = -0.05 + (0 - (-0.05)) * ease;
         
         // Cinematic 360-degree spin mapped directly to scroll!
         idCardSpring.current.rotY = ease * Math.PI * 2;
         
         // Freeze velocities so it doesn't snap when physics resumes
         idCardSpring.current.velocityX = 0;
         idCardSpring.current.velocityY = 0;
         idCardSpring.current.velocityRotZ = 0;
      } else {
         // Apply bouncy physics to all axes for organic entry
         idCardSpring.current.velocityY += (targetY - idCardSpring.current.y) * stiffness;
         idCardSpring.current.velocityY *= damping;
         idCardSpring.current.y += idCardSpring.current.velocityY;

         idCardSpring.current.velocityX += (targetX - idCardSpring.current.x) * stiffness;
         idCardSpring.current.velocityX *= damping;
         idCardSpring.current.x += idCardSpring.current.velocityX;

         idCardSpring.current.velocityRotZ += (targetRotZ - idCardSpring.current.rotZ) * stiffness;
         idCardSpring.current.velocityRotZ *= damping;
         idCardSpring.current.rotZ += idCardSpring.current.velocityRotZ;
         
         idCardSpring.current.rotY = 0;
      }
      
      idCardRef.current.position.y = idCardSpring.current.y;
      idCardRef.current.position.x = idCardSpring.current.x;
      idCardRef.current.rotation.z = idCardSpring.current.rotZ;
      idCardRef.current.rotation.y = idCardSpring.current.rotY;
      
      // Optional subtle floating when settled (disabled during the transition phase)
      if (off >= 0.21 && off <= 0.55 && !(off > 0.34 && off <= 0.43)) {
         idCardRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
         idCardRef.current.rotation.z += Math.cos(state.clock.elapsedTime * 1.2) * 0.02;
      }
    }
  });

  return (
    <group>
      {/* Lights for the 3D ID Card */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} />
      <directionalLight position={[-10, 5, -5]} intensity={1} color="#4488ff" />

      {/* 1. ABOUT Text */}
      <group ref={textRef} position={[0, -viewport.height * 5, 0]}>
        <Text
          position={[0, viewport.height * 1.0, -10]}
          fontSize={viewport.width > 5 ? 3 : 1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          ABOUT
        </Text>
      </group>



      {/* 2. EXPERIENCE Text */}
      <group ref={expTextRef} position={[0, viewport.height * 2, 0]}>
        <Text
          position={[0, 0, -10]}
          fontSize={viewport.width > 5 ? 2.5 : 1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          EXPERIENCE
        </Text>
      </group>

      {/* 3. 3D ID Card */}
      <group ref={idCardRef} position={[0, viewport.height * 2, 0]}>
         {/* Purple Ambient Glow Bleed */}
         <pointLight position={[0, -0.4, -0.5]} intensity={5.0} distance={15} color="#a020f0" />
         
         {/* ID Box */}
         <mesh position={[0, -0.4, 0]} rotation={[0, 0, -0.03]}>
            <boxGeometry args={[1.6, 2.16, 0.08]} />
            
            {/* Glowing Teal Rim-Light Outline */}
            <Edges scale={1.01} threshold={15} color="#00f0ff" />
            
            <meshStandardMaterial attach="material-0" color="#111" />
            <meshStandardMaterial attach="material-1" color="#111" />
            <meshStandardMaterial attach="material-2" color="#111" />
            <meshStandardMaterial attach="material-3" color="#111" />
            <meshStandardMaterial attach="material-4" map={profileTex} roughness={0.2} metalness={0.1} />
            <meshStandardMaterial attach="material-5" color="#050505" />
         </mesh>
      </group>

    </group>
  );
};

export const AboutHtmlOverlay: React.FC = () => {
  const scroll = useScroll();
  const htmlDivRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!scroll || !htmlDivRef.current) return;
    const off = scroll.offset;

    if (off < 0.15) {
      htmlDivRef.current.style.transform = `translateX(100vw)`;
      htmlDivRef.current.style.opacity = '0';
    } else if (off < 0.25) {
      const p = (off - 0.15) / 0.1;
      const easeOut = 1 - Math.pow(1 - p, 3);
      const xOffset = 100 - (easeOut * 100);
      htmlDivRef.current.style.transform = `translateX(${xOffset}vw)`;
      htmlDivRef.current.style.opacity = `${easeOut}`;
    } else if (off <= 0.45) {
      htmlDivRef.current.style.transform = `translateX(0vw)`;
      htmlDivRef.current.style.opacity = '1';
    } else if (off <= 0.55) {
      const p = (off - 0.45) / 0.1;
      htmlDivRef.current.style.transform = `translateY(-${p * 50}vh)`;
      htmlDivRef.current.style.opacity = `${1 - p}`;
    } else {
      htmlDivRef.current.style.opacity = '0';
    }
  });

  return (
    <div className="w-screen h-screen flex items-center justify-end pr-[5vw] md:pr-[10vw] pointer-events-none fixed top-0 left-0 overflow-hidden">
       <div 
         ref={htmlDivRef}
         className="w-[85vw] md:w-[45vw] text-white flex flex-col p-8 md:p-12 bg-[#050505]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl transition-transform duration-75 pointer-events-auto"
         style={{ transform: 'translateX(100vw)', opacity: 0 }}
       >
         <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{resumeData.name}</h2>
         <h3 className="text-blue-400 text-lg md:text-xl mb-8 uppercase tracking-[0.2em] font-medium">{resumeData.title}</h3>
         
         <div className="space-y-4">
            {resumeData.about.split('. ').map((sentence, i) => (
              sentence && <p key={i} className="text-gray-300 text-base md:text-lg leading-relaxed">{sentence}.</p>
            ))}
         </div>

         <div className="mt-10">
           <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-semibold">Core Competencies</h4>
           <div className="flex flex-wrap gap-2">
             {Object.values(resumeData.skills).flat().slice(0, 10).map((s, i) => (
               <span key={i} className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                 {s as string}
               </span>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';
import { resumeData } from '../../data/resume';
import { initFluidEngine } from '../fluid/FluidEngine';
import { ProfileSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { SkillsHtmlOverlay } from './SkillsHtmlOverlay';
import { ContactSection } from './ContactSection';
import { ContactHtmlOverlay } from './ContactHtmlOverlay';

// Broadcasts scroll offset to DOM elements outside the canvas
const ScrollTracker = () => {
  const scroll = useScroll();
  useFrame(() => {
    if (scroll) {
      window.dispatchEvent(new CustomEvent('scroll-update', { detail: scroll.offset }));
    }
  });

  useEffect(() => {
    const handleScrollTo = (e: any) => {
      if (scroll && scroll.el) {
        const targetOffset = e.detail;
        const targetTop = targetOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
        scroll.el.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    };
    window.addEventListener('scroll-to', handleScrollTo as EventListener);
    return () => window.removeEventListener('scroll-to', handleScrollTo as EventListener);
  }, [scroll]);

  return null;
};

// Pure DOM overlay outside the Canvas
const ProfileHtmlOverlay = () => {
  const htmlDivRef = useRef<HTMLDivElement>(null);
  const intern1Ref = useRef<HTMLDivElement>(null);
  const intern2Ref = useRef<HTMLDivElement>(null);
  const intern1PointsRef = useRef<(HTMLLIElement | null)[]>([]);
  const intern2PointsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = (e: any) => {
      const off = e.detail;

      // 1. About Bio
      if (htmlDivRef.current) {
        if (off < 0.05) {
          htmlDivRef.current.style.transform = `translateX(100vw)`;
          htmlDivRef.current.style.opacity = '0';
        } else if (off < 0.10) {
          const p = (off - 0.05) / 0.05;
          const easeOut = 1 - Math.pow(1 - p, 3);
          const xOffset = 100 - (easeOut * 100);
          htmlDivRef.current.style.transform = `translateX(${xOffset}vw)`;
          htmlDivRef.current.style.opacity = `${easeOut}`;
        } else if (off <= 0.18) {
          htmlDivRef.current.style.transform = `translateX(0vw)`;
          htmlDivRef.current.style.opacity = '1';
        } else if (off <= 0.25) {
          const p = (off - 0.18) / 0.07;
          htmlDivRef.current.style.transform = `translateY(-${p * 50}vh)`;
          htmlDivRef.current.style.opacity = `${1 - p}`;
        } else {
          htmlDivRef.current.style.opacity = '0';
        }
      }

      // 2. Internship 1 (Right)
      if (intern1Ref.current) {
        if (off < 0.25) {
          intern1Ref.current.style.transform = `translateX(50vw)`;
          intern1Ref.current.style.opacity = '0';
        } else if (off < 0.29) {
          const p = (off - 0.25) / 0.04;
          const easeOut = 1 - Math.pow(1 - p, 3);
          intern1Ref.current.style.transform = `translateX(${50 - (easeOut * 50)}vw)`;
          intern1Ref.current.style.opacity = `${easeOut}`;
        } else if (off <= 0.40) {
          intern1Ref.current.style.transform = `translateX(0vw)`;
          intern1Ref.current.style.opacity = '1';
        } else if (off <= 0.48) {
          const p = (off - 0.40) / 0.08;
          intern1Ref.current.style.transform = `translateY(-${p * 50}vh)`;
          intern1Ref.current.style.opacity = `${1 - p}`;
        } else {
          intern1Ref.current.style.opacity = '0';
        }

        // Line by line bullets
        resumeData.experience[0].points.forEach((_, i) => {
          if (!intern1PointsRef.current[i]) return;
          const startOff = 0.25 + (i * 0.013);
          if (off < startOff) {
            intern1PointsRef.current[i]!.style.opacity = '0';
            intern1PointsRef.current[i]!.style.transform = 'translateX(20px)';
          } else if (off < startOff + 0.017) {
            const p = (off - startOff) / 0.017;
            intern1PointsRef.current[i]!.style.opacity = `${p}`;
            intern1PointsRef.current[i]!.style.transform = `translateX(${20 - p * 20}px)`;
          } else {
            intern1PointsRef.current[i]!.style.opacity = '1';
            intern1PointsRef.current[i]!.style.transform = 'translateX(0px)';
          }
        });
      }

      // 3. Internship 2 (Left)
      if (intern2Ref.current) {
        if (off < 0.29) {
          intern2Ref.current.style.transform = `translateX(-50vw)`;
          intern2Ref.current.style.opacity = '0';
        } else if (off < 0.33) {
          const p = (off - 0.29) / 0.04;
          const easeOut = 1 - Math.pow(1 - p, 3);
          intern2Ref.current.style.transform = `translateX(${-50 + (easeOut * 50)}vw)`;
          intern2Ref.current.style.opacity = `${easeOut}`;
        } else if (off <= 0.40) {
          intern2Ref.current.style.transform = `translateX(0vw)`;
          intern2Ref.current.style.opacity = '1';
        } else if (off <= 0.48) {
          const p = (off - 0.40) / 0.08;
          intern2Ref.current.style.transform = `translateY(-${p * 50}vh)`;
          intern2Ref.current.style.opacity = `${1 - p}`;
        } else {
          intern2Ref.current.style.opacity = '0';
        }

        // Line by line bullets
        resumeData.experience[1].points.forEach((_, i) => {
          if (!intern2PointsRef.current[i]) return;
          const startOff = 0.29 + (i * 0.013);
          if (off < startOff) {
            intern2PointsRef.current[i]!.style.opacity = '0';
            intern2PointsRef.current[i]!.style.transform = 'translateX(-20px)';
          } else if (off < startOff + 0.017) {
            const p = (off - startOff) / 0.017;
            intern2PointsRef.current[i]!.style.opacity = `${p}`;
            intern2PointsRef.current[i]!.style.transform = `translateX(${-20 + p * 20}px)`;
          } else {
            intern2PointsRef.current[i]!.style.opacity = '1';
            intern2PointsRef.current[i]!.style.transform = 'translateX(0px)';
          }
        });
      }
    };

    window.addEventListener('scroll-update', handleScroll);
    return () => window.removeEventListener('scroll-update', handleScroll);
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!htmlDivRef.current) return;
      if (parseFloat(htmlDivRef.current.style.opacity || '0') === 0) {
        setIsHovered(false);
        return;
      }
      const rect = htmlDivRef.current.getBoundingClientRect();
      const inBounds =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      setIsHovered(inBounds);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-50 overflow-hidden">
      {/* 1. ABOUT BIO (Right Side) */}
      <div className="absolute right-0 top-0 h-full flex items-center justify-end pr-[5vw] md:pr-[10vw]">
        <div
          ref={htmlDivRef}
          className={`w-[85vw] md:w-[45vw] mt-[25vh] text-white flex flex-col p-8 md:p-12 bg-[#050505]/95 backdrop-blur-3xl rounded-3xl border transition-all duration-500 ease-out pointer-events-none ${isHovered ? 'shadow-[0_0_40px_rgba(59,130,246,0.15)] border-blue-500/30' : 'shadow-2xl border-white/10'
            }`}
          style={{ transform: 'translateX(100vw)', opacity: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{resumeData.name}</h2>
          <h3 className="text-blue-400 text-lg md:text-xl mb-8 uppercase tracking-[0.2em] font-medium">{resumeData.title}</h3>
          <div className="space-y-4">
            {resumeData.about.split('. ').map((sentence, i) => (
              sentence && <p key={i} className="text-gray-300 text-base md:text-lg leading-relaxed">{sentence}.</p>
            ))}
          </div>
        </div>
      </div>

      {/* 2. INTERNSHIP 1 (Right Side) */}
      <div className="absolute right-0 top-0 h-full flex items-center justify-end pr-[5vw] md:pr-[5vw] w-full md:w-[35vw]">
        <div
          ref={intern1Ref}
          className="mt-[20vh] text-white flex flex-col p-6 md:p-8 bg-[#050505]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-100 ease-out"
          style={{ transform: 'translateX(50vw)', opacity: 0 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{resumeData.experience[0].company}</h3>
          <p className="text-blue-400 font-medium text-sm md:text-base mb-4">{resumeData.experience[0].role} | {resumeData.experience[0].date}</p>
          <ul className="space-y-3">
            {resumeData.experience[0].points.map((pt, i) => (
              <li
                key={i}
                ref={(el) => { intern1PointsRef.current[i] = el; }}
                className="text-gray-300 text-sm md:text-base leading-relaxed flex items-start"
                style={{ opacity: 0, transform: 'translateX(20px)' }}
              >
                <span className="text-blue-500 mr-3 mt-1">▹</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. INTERNSHIP 2 (Left Side) */}
      <div className="absolute left-0 top-0 h-full flex items-center justify-start pl-[5vw] md:pl-[5vw] w-full md:w-[35vw]">
        <div
          ref={intern2Ref}
          className="mt-[20vh] text-white flex flex-col p-6 md:p-8 bg-[#050505]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-100 ease-out"
          style={{ transform: 'translateX(-50vw)', opacity: 0 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{resumeData.experience[1].company}</h3>
          <p className="text-blue-400 font-medium text-sm md:text-base mb-4">{resumeData.experience[1].role} | {resumeData.experience[1].date}</p>
          <ul className="space-y-3">
            {resumeData.experience[1].points.map((pt, i) => (
              <li
                key={i}
                ref={(el) => { intern2PointsRef.current[i] = el; }}
                className="text-gray-300 text-sm md:text-base leading-relaxed flex items-start"
                style={{ opacity: 0, transform: 'translateX(-20px)' }}
              >
                <span className="text-blue-500 mr-3 mt-1">▹</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// R3F Component for Dust, Embers, and Energy Sparks
const ParticleSystem: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Points>(null);
  const sparkRef = useRef<THREE.Points>(null);

  const particleCount = isMobile ? 800 : 2000;
  const emberCount = isMobile ? 200 : 500;
  const sparkCount = isMobile ? 20 : 50;

  // Dust particles
  const [positions, basePositions, scales] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const base = new Float32Array(particleCount * 3);
    const sca = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      sca[i] = Math.random() * 0.5 + 0.5;
    }
    return [pos, base, sca];
  }, [particleCount]);

  // Fire Embers
  const [emberPositions, emberScales, emberColors] = React.useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const sca = new Float32Array(emberCount);
    const col = new Float32Array(emberCount * 3);
    const color = new THREE.Color();
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sca[i] = Math.random() * 1.5 + 0.5;

      color.setHSL(Math.random() * 0.05 + 0.02, 1.0, Math.random() * 0.5 + 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, sca, col];
  }, [emberCount]);

  // Energy Sparks
  const [sparkPositions, sparkScales] = React.useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const sca = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sca[i] = Math.random() * 2.0 + 1.0;
    }
    return [pos, sca];
  }, [sparkCount]);

  const scroll = useScroll();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    // Prevent massive physics jumps
    const dt = Math.min(delta, 1 / 30);

    if (pointsRef.current) {
      pointsRef.current.rotation.y += dt * 0.05;
      pointsRef.current.rotation.x += dt * 0.02;

      const off = scroll ? scroll.offset : 0;
      const isAboutActive = off >= 0.10 && off <= 0.25;
      const targetX = viewport.width > 5 ? -viewport.width * 0.32 : 0;

      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

      // Converge 20% of particles to form a halo around the ID card
      for (let i = 0; i < particleCount; i++) {
        if (i % 5 === 0) {
          const i3 = i * 3;
          if (isAboutActive) {
            const angle = i * 0.1;
            // Frame is roughly 1.6 x 2.16
            const haloX = targetX + Math.cos(angle) * 1.5;
            const haloY = Math.sin(angle) * 1.8;

            posArray[i3] += (haloX - posArray[i3]) * dt * 2.0;
            posArray[i3 + 1] += (haloY - posArray[i3 + 1]) * dt * 2.0;
            posArray[i3 + 2] += (0 - posArray[i3 + 2]) * dt * 2.0;
          } else {
            // Drift back to original cloud position
            posArray[i3] += (basePositions[i3] - posArray[i3]) * dt * 1.0;
            posArray[i3 + 1] += (basePositions[i3 + 1] - posArray[i3 + 1]) * dt * 1.0;
            posArray[i3 + 2] += (basePositions[i3 + 2] - posArray[i3 + 2]) * dt * 1.0;
          }
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (emberRef.current) {
      const positions = emberRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3 + 1] += delta * (Math.random() * 0.5 + 0.5);
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 2 + i) * delta * 0.2;

        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = -10;
          positions[i * 3] = (Math.random() - 0.5) * 15;
        }
      }
      emberRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (sparkRef.current) {
      const positions = sparkRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        positions[i * 3 + 1] += delta * (Math.random() * 2.0 + 1.0);
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 10 + i) * delta * 1.5;

        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = -10;
          positions[i * 3] = (Math.random() - 0.5) * 10;
        }
      }
      sparkRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#88aaff" transparent opacity={0.3} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[emberColors, 3]} />
          <bufferAttribute attach="attributes-scale" args={[emberScales, 1]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={sparkRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[sparkScales, 1]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.9} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

// 1. Camera Rig (Sine-wave drift + Mouse Parallax)
const CameraRig = () => {
  const { camera } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    // Parallax only. No Z-travel since we are doing standard vertical scroll now.
    const targetX = mouse.current.x * 2;
    const targetY = mouse.current.y * 2;

    // Sine-wave drift (breathing)
    const driftX = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    const driftY = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;

    // Smooth interpolation (spring-like easing)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX + driftX, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY + driftY, 2, delta);
    // Keep camera fixed on Z
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5, 4, delta);

    // Look slightly towards the center ahead
    const lookAtTarget = new THREE.Vector3(0, 0, -10);
    camera.quaternion.slerp(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, lookAtTarget, new THREE.Vector3(0, 1, 0))
      ),
      delta * 2
    );
  });

  return null;
};

// Interactive Home Text with 3D Tilt Parallax (CSS Perspective)
const HomeTextGroup = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useFrame((state) => {
    if (divRef.current) {
      const targetRotateX = state.pointer.y * 9;
      const targetRotateY = state.pointer.x * 9;
      divRef.current.style.transform = `perspective(1000px) rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Html center zIndexRange={[100, 0]}>
        <div
          ref={divRef}
          className="flex flex-col items-center justify-center w-screen drop-shadow-[0_0_20px_rgba(0,0,1)] transition-transform duration-100 ease-out"
        >
          <h1 className="text-white text-6xl md:text-8xl font-bold tracking-widest uppercase text-center drop-shadow-[0_0_25px_rgba(0,0,0,1)]">
            {resumeData.name}
          </h1>
          <p className="text-gray-300 mt-6 tracking-[0.3em] text-sm md:text-lg uppercase drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            {resumeData.title}
          </p>
        </div>
      </Html>
    </group>
  );
};

export const PortfolioApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    if (!canvasRef.current) return;
    const cleanup = initFluidEngine(canvasRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
          <CameraRig />
          <ParticleSystem isMobile={isMobile} />

          <ScrollControls pages={10} damping={0.2} style={{ scrollBehavior: 'smooth' }}>
            <ScrollTracker />
            <Scroll>
              {/* HOME (Y: 0) - Scrolls away naturally */}
              <HomeTextGroup />
            </Scroll>

            {/* ABOUT & EXPERIENCE SECTION - Manually controlled physics animation */}
            <ProfileSection />
            {/* PROJECTS SECTION - Manually controlled parallax outside the main scroll wrapper */}
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
          </ScrollControls>
        </Canvas>
      </div>

      {/* Pure DOM UI Overlays */}
      <ProfileHtmlOverlay />
      <SkillsHtmlOverlay />
      <ContactHtmlOverlay />

      {/* Game Gallery Link (Top Left) */}
      <div className="absolute top-8 left-10 z-[60] flex items-center gap-6">
        <a
          href="https://speedrun-velocity.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] text-sm font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
        >
          Game Gallery <span className="text-lg leading-none">↗</span>
        </a>
      </div>

      {/* Navigation Nodes (Top Right) */}
      <div className="absolute top-8 right-10 z-[60] flex items-center gap-6">
        {[
          { name: 'Home', offset: 0 },
          { name: 'About', offset: 0.12 },
          { name: 'Experience', offset: 0.30 },
          { name: 'Projects', offset: 0.50 },
          { name: 'Skills', offset: 0.70 },
          { name: 'Contact', offset: 0.90 }
        ].map((nav) => (
          <button
            key={nav.name}
            onClick={() => window.dispatchEvent(new CustomEvent('scroll-to', { detail: nav.offset }))}
            className="text-white/60 hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] text-sm font-semibold tracking-widest uppercase transition-all duration-300"
          >
            {nav.name}
          </button>
        ))}
      </div>

    </div>
  );
};

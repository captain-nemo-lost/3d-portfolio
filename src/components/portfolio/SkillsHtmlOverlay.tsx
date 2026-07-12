import { useRef, useState, useEffect } from 'react';
import { resumeData } from '../../data/resume';

export const SkillsHtmlOverlay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = [
    { title: "Programming", items: resumeData.skills.programming },
    { title: "Frameworks", items: resumeData.skills.frameworks },
    { title: "Tools", items: resumeData.skills.tools },
    { title: "Concepts", items: resumeData.skills.concepts },
  ];

  useEffect(() => {
    const handleScroll = (e: any) => {
      const off = e.detail;

      // Global container visibility (only visible between 0.72 and 0.85)
      if (containerRef.current) {
        if (off < 0.72 || off > 0.85) {
          containerRef.current.style.opacity = '0';
        } else {
          containerRef.current.style.opacity = '1';
        }
      }

      // Title Animation Removed because it's now in 3D

      // Left Block Animation (0.74 - 0.77)
      if (leftBlockRef.current) {
        if (off < 0.74 || off > 0.85) {
          leftBlockRef.current.style.opacity = '0';
          leftBlockRef.current.style.transform = 'translateX(-100px)';
        } else if (off < 0.77) {
          const p = (off - 0.74) / 0.03;
          const easeOut = 1 - Math.pow(1 - p, 3);
          leftBlockRef.current.style.opacity = `${easeOut}`;
          leftBlockRef.current.style.transform = `translateX(${-100 + easeOut * 100}px)`;
        } else if (off > 0.84) {
          const p = (off - 0.84) / 0.01;
          leftBlockRef.current.style.opacity = `${1 - p}`;
          leftBlockRef.current.style.transform = `translateX(${-p * 100}px)`;
        } else {
          leftBlockRef.current.style.opacity = '1';
          leftBlockRef.current.style.transform = 'translateX(0px)';
        }
      }

      // Determine active category based on scroll offset (0.77 to 0.85)
      let newActiveIndex = 0;
      if (off > 0.83) newActiveIndex = 3;
      else if (off > 0.81) newActiveIndex = 2;
      else if (off > 0.79) newActiveIndex = 1;

      if (newActiveIndex !== activeCategoryIndex) {
        setActiveCategoryIndex(newActiveIndex);
      }

      // Right Blocks Animations
      categories.forEach((_, idx) => {
        const block = rightBlocksRef.current[idx];
        if (!block) return;

        const startOff = 0.77 + (idx * 0.02);
        const endOff = startOff + 0.02;
        const transitionZone = 0.01;

        if (off < startOff) {
          // Hasn't entered yet (waiting on the right)
          block.style.opacity = '0';
          block.style.transform = 'translateX(100px)';
        } else if (off < startOff + transitionZone) {
          // Entering
          const p = (off - startOff) / transitionZone;
          block.style.opacity = `${p}`;
          block.style.transform = `translateX(${100 - p * 100}px)`;
        } else if (idx === categories.length - 1 && off <= 0.84) {
          // Settled (If it's the last block, it stays until 0.84)
          block.style.opacity = '1';
          block.style.transform = 'translateX(0px)';
        } else if (idx === categories.length - 1 && off > 0.84) {
          // Last block exiting for Contact section
          const p = (off - 0.84) / 0.01;
          block.style.opacity = `${1 - p}`;
          block.style.transform = `translateX(${p * 100}px)`;
        } else if (off < endOff) {
          // Exiting (sliding right again)
          const p = (off - (endOff - transitionZone)) / transitionZone;
          block.style.opacity = `${1 - p}`;
          block.style.transform = `translateX(${p * 100}px)`;
        } else {
          // Exited
          block.style.opacity = '0';
          block.style.transform = 'translateX(100px)';
        }
      });
    };

    window.addEventListener('scroll-update', handleScroll);
    return () => window.removeEventListener('scroll-update', handleScroll);
  }, [activeCategoryIndex]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 w-full h-full flex flex-col justify-center items-center px-10 pointer-events-none opacity-0 mt-32">

      <div className="flex w-full max-w-6xl h-auto max-h-[70vh] flex-1 gap-12 relative items-center">

        {/* 2. Left Block (Navigation & Learning Card) */}
        <div ref={leftBlockRef} className="w-1/3 flex flex-col justify-center gap-12 opacity-0 shrink-0">
          <div className="flex flex-col gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.title}
                className={`text-2xl font-bold tracking-widest transition-all duration-500 ${activeCategoryIndex === idx
                    ? 'text-white translate-x-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                    : 'text-gray-600'
                  }`}
              >
                {cat.title}
              </div>
            ))}
          </div>

          {/* Always Learning Card */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 mt-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-white/80 font-bold text-lg mb-2">Always learning.</h3>
            <p className="text-[#00f0ff] font-bold text-lg">Always building.</p>
          </div>
        </div>

        {/* 3. Right Block (Dynamic Skill Cards) */}
        <div className="w-2/3 relative h-[300px]">
          {categories.map((cat, idx) => (
            <div
              key={cat.title}
              ref={(el) => { rightBlocksRef.current[idx] = el; }}
              className="absolute inset-0 w-full h-full opacity-0 flex items-center"
              style={{ transform: 'translateX(100px)' }}
            >
              <div className="grid grid-cols-2 gap-4 w-full content-center">
                {cat.items.map((skill) => (
                  <div
                    key={skill}
                    className="bg-black/60 border border-white/20 rounded-lg p-5 flex items-center justify-between
                               backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  >
                    <span className="text-white/90 font-medium tracking-wide text-lg">{skill}</span>
                    <span className="text-[#a020f0]/60 font-mono text-sm">{'</>'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

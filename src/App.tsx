import React, { useState, useEffect } from 'react';
import { PortfolioApp } from './components/portfolio/PortfolioApp';
import { resumeData } from './data/resume';
import './index.css';

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const projects = resumeData.projects;

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetProject = customEvent.detail;
      const idx = projects.findIndex(p => p.title === targetProject.title);
      setSelectedIndex(idx !== -1 ? idx : 0);
    };
    window.addEventListener('openProjectModal', handleOpenModal);
    return () => window.removeEventListener('openProjectModal', handleOpenModal);
  }, [projects]);

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? projects.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === projects.length - 1 ? 0 : selectedIndex + 1);
  };

  const project = selectedIndex !== null ? projects[selectedIndex] : null;

  return (
    <>
      <PortfolioApp />
      
      {/* Premium High-Fidelity Project Modal */}
      {project && (
        <div className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-[9999] font-sans transition-opacity duration-500 pointer-events-auto">
          
          {/* Main Modal Container */}
          <div className="bg-[#050505] border border-white/5 rounded-2xl max-w-[1200px] w-full flex flex-col relative shadow-2xl h-[90vh] md:h-[85vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedIndex(null)} 
              className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>

            {/* Content Area */}
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
              
              {/* LEFT SIDE: Visuals */}
              <div className="w-full md:w-[55%] flex bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 relative p-4 md:p-6 shrink-0">
                
                {/* Vertical Thumbnail Gallery */}
                <div className="hidden md:flex flex-col w-20 h-full border-r border-white/5 pr-4 mr-6 items-center justify-center gap-4">
                  <button className="text-white/30 hover:text-white pb-2">∧</button>
                  <div className="w-16 h-16 rounded-xl border-2 border-blue-500/80 overflow-hidden bg-[#111] p-1">
                    <img src={project.image || '/about-photo.png'} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden opacity-30 hover:opacity-100 transition-opacity bg-[#111] p-1">
                    <img src={project.image || '/about-photo.png'} className="w-full h-full object-cover rounded-lg grayscale" />
                  </div>
                  <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden opacity-30 hover:opacity-100 transition-opacity bg-[#111] p-1">
                    <img src={project.image || '/about-photo.png'} className="w-full h-full object-cover rounded-lg grayscale" />
                  </div>
                  <button className="text-white/30 hover:text-white pt-2">∨</button>
                </div>

                {/* Main Featured Image */}
                <div className="flex-1 h-full flex items-center justify-center relative">
                  <div className="w-full h-full border border-white/10 p-2 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent">
                    <img 
                      src={project.image || '/about-photo.png'} 
                      className="w-full h-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Information */}
              <div className="w-full md:w-[45%] p-6 md:p-12 flex flex-col overflow-y-visible md:overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                
                {/* Category Pill */}
                <div className="mb-8">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-blue-400 border border-blue-400/20 px-3 py-1.5 rounded-full bg-blue-400/5">
                    {project.title === 'KATE' ? 'AI / SYSTEMS' : project.title === 'FinSight' ? 'FINANCE / APP' : 'WEB / PLATFORM'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  {project.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-medium text-gray-300 mb-6 tracking-tight leading-snug">
                  ({project.subtitle})
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-4">
                  {project.points[0]} {project.points[1] && project.points[1]}
                </p>

                {/* Technologies Used */}
                <div className="mb-8">
                  <h4 className="text-[10px] text-gray-500 tracking-[0.15em] font-semibold uppercase mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 rounded-lg bg-[#111] border border-white/5 text-xs text-gray-300 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-10 flex-1">
                  <h4 className="text-[10px] text-gray-500 tracking-[0.15em] font-semibold uppercase mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {project.points.map((p: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-400 leading-relaxed">
                        <CheckIcon />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div>
                  <h4 className="text-[10px] text-gray-500 tracking-[0.15em] font-semibold uppercase mb-4">Links</h4>
                  <div className="flex flex-col gap-3 max-w-sm">
                    <button className="w-full flex items-center justify-between px-6 py-3.5 rounded-xl bg-[#1e2640] border border-[#2e3b6a] text-[#7b9bf5] hover:bg-[#253050] transition-colors font-medium text-sm">
                      <span>Live Demo</span>
                      <span className="text-lg leading-none">↗</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#111] border border-white/10 text-gray-300 hover:bg-[#1a1a1a] transition-colors font-medium text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <span>GitHub Repository</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* BOTTOM BAR: Pagination */}
            <div className="h-16 md:h-20 border-t border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a] rounded-b-2xl shrink-0">
              <button 
                onClick={handlePrev} 
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-[0.15em] flex items-center gap-1 md:gap-3 font-medium"
              >
                <span className="text-lg">←</span> <span className="hidden md:inline">Prev Project</span>
              </button>
              
              <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500 font-mono tracking-wider">
                  0{(selectedIndex ?? 0) + 1} <span className="mx-2 text-gray-700">/</span> 0{projects.length}
                </span>
                <div className="flex gap-1.5">
                  {projects.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-[3px] rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-6 bg-blue-500' : 'w-4 bg-white/10'}`} 
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={handleNext} 
                className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-[0.15em] flex items-center gap-1 md:gap-3 font-medium"
              >
                <span className="hidden md:inline">Next Project</span> <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

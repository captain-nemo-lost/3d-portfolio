import { useEffect, useRef, useState } from 'react';
import { resumeData } from '../../data/resume';

export const ContactHtmlOverlay = () => {
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      const off = e.detail;
      
      // Contact HTML Entry
      if (leftDivRef.current && rightDivRef.current && footerRef.current) {
        if (off < 0.78) {
          leftDivRef.current.style.transform = `translateX(-100vw)`;
          leftDivRef.current.style.opacity = '0';
          rightDivRef.current.style.transform = `translateX(100vw)`;
          rightDivRef.current.style.opacity = '0';
          footerRef.current.style.opacity = '0';
        } else if (off < 0.88) {
          const p = (off - 0.78) / 0.10;
          const easeOut = 1 - Math.pow(1 - p, 3);
          
          leftDivRef.current.style.transform = `translateX(${-100 + (easeOut * 100)}vw)`;
          leftDivRef.current.style.opacity = `${easeOut}`;
          
          rightDivRef.current.style.transform = `translateX(${100 - (easeOut * 100)}vw)`;
          rightDivRef.current.style.opacity = `${easeOut}`;
          
          footerRef.current.style.opacity = `${easeOut}`;
        } else {
          leftDivRef.current.style.transform = `translateX(0vw)`;
          leftDivRef.current.style.opacity = '1';
          rightDivRef.current.style.transform = `translateX(0vw)`;
          rightDivRef.current.style.opacity = '1';
          footerRef.current.style.opacity = '1';
        }
      }
    };

    window.addEventListener('scroll-update', handleScroll);
    return () => window.removeEventListener('scroll-update', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-50 overflow-hidden flex flex-col md:flex-row justify-center md:justify-between px-[5vw] md:px-[10vw] pt-[15vh] md:pt-[10vh] gap-8 md:gap-0">
      
      {/* LEFT BLOCK: Let's Create the Future */}
      <div className="flex items-center justify-start w-full md:w-[40vw]">
        <div
          ref={leftDivRef}
          className="flex flex-col p-4 md:p-8 bg-transparent pointer-events-auto"
          style={{ transform: 'translateX(-100vw)', opacity: 0 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-white leading-tight">
            Let's Create <br />
            the <span className="text-blue-500">Future</span>
            <span className="text-blue-400 ml-2 animate-pulse">✦</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-10 leading-relaxed max-w-md">
            I'm always excited to work on innovative projects and solve challenging problems. 
            If you have an idea or opportunity in mind, let's connect!
          </p>

          {/* Open to Opportunities Block */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 rounded-2xl bg-[#050505]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.1)] gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-4">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs md:text-sm text-blue-400 font-semibold mb-1">Open to Opportunities</h4>
                <p className="text-[10px] md:text-xs text-gray-400 max-w-[180px] md:max-w-[200px]">Available for full-time roles, freelance projects, and collaborations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT BLOCK: Social Links */}
      <div className="flex items-center justify-end w-full md:w-[40vw]">
        <div
          ref={rightDivRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          className={`flex flex-col p-6 md:p-8 bg-[#050505]/95 backdrop-blur-3xl rounded-3xl border transition-all duration-500 ease-out pointer-events-auto w-full ${isHovered ? 'shadow-[0_0_40px_rgba(59,130,246,0.15)] border-blue-500/30' : 'shadow-2xl border-white/10'}`}
          style={{ transform: 'translateX(100vw)', opacity: 0 }}
        >
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Email */}
            <a 
              href={`mailto:${resumeData.email}`}
              className="flex items-center p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center mr-4 group-hover:bg-[#1a1a1a] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[9px] md:text-[10px] text-blue-400 font-semibold uppercase tracking-widest mb-1">Email</h4>
                <p className="text-xs md:text-sm text-gray-300 font-medium">{resumeData.email}</p>
              </div>
              <span className="text-gray-600 group-hover:text-blue-400 transition-colors">↗</span>
            </a>

            {/* LinkedIn */}
            <a 
              href={resumeData.linkedin} 
              target="_blank" rel="noreferrer"
              className="flex items-center p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center mr-4 group-hover:bg-[#1a1a1a] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-[9px] md:text-[10px] text-blue-400 font-semibold uppercase tracking-widest mb-1">LinkedIn</h4>
                <p className="text-xs md:text-sm text-gray-300 font-medium truncate">linkedin.com/in/abhimanyu-sharma</p>
              </div>
              <span className="text-gray-600 group-hover:text-blue-400 transition-colors">↗</span>
            </a>

            {/* GitHub */}
            <a 
              href={resumeData.github} 
              target="_blank" rel="noreferrer"
              className="flex items-center p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center mr-4 group-hover:bg-[#1a1a1a] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-[9px] md:text-[10px] text-blue-400 font-semibold uppercase tracking-widest mb-1">GitHub</h4>
                <p className="text-xs md:text-sm text-gray-300 font-medium truncate">{resumeData.github.replace('https://github.com/', 'github.com/')}</p>
              </div>
              <span className="text-gray-600 group-hover:text-blue-400 transition-colors">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER LINK */}
      <div 
        ref={footerRef}
        className="absolute bottom-6 left-0 w-full flex justify-center items-center pointer-events-auto z-[60] transition-opacity duration-500"
        style={{ opacity: 0 }}
      >
        <p className="text-gray-500 text-xs md:text-sm tracking-wide">
          if you wanna see something else, click <a href="https://sharma-abhimanyu.vercel.app/" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">here</a>.
        </p>
      </div>

    </div>
  );
};

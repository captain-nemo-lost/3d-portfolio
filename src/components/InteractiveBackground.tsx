import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const InteractiveBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax effect on the background grid
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-background">
      {/* Base Grid */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          y,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Dynamic Ambient Lighting */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(59, 130, 246, 0.08) 0%, rgba(0, 0, 0, 0) 50%)`
        }}
      />
    </div>
  );
};

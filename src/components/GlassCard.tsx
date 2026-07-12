import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const GlassCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative z-10 flex flex-col items-center justify-center p-12 overflow-hidden rounded-3xl glass glass-hover max-w-2xl w-full mx-4 shadow-2xl group"
    >
      {/* Inner Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          Cinematic
          <br />
          Experience
        </h1>
        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-md mx-auto font-light leading-relaxed">
          Ultra-premium WebGL-inspired interactions designed for the modern web. Smooth, magnetic, and deeply immersive.
        </p>
        
        <button className="interactive group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide overflow-hidden transition-transform hover:scale-105 active:scale-95">
          <span className="relative z-10">Discover More</span>
          <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </motion.div>
    </motion.div>
  );
};

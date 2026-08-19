import React from 'react';
import { motion } from 'framer-motion';

const AIAvatar = ({ isSpeaking }) => {
  return (
    <div className="relative flex items-center justify-center p-8">
      {/* Outer Glow / Ripple Effect */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: 'var(--theme-color-1)' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border"
            style={{ borderColor: 'var(--theme-color-2)' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </>
      )}

      {/* Core Avatar */}
      <motion.div 
        className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center 
                    bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10`}
        style={{
          boxShadow: isSpeaking 
            ? `0 0 40px var(--theme-color-1), 0 0 80px var(--theme-color-2)` 
            : `0 0 20px var(--theme-color-1)`
        }}
        animate={{
          boxShadow: isSpeaking 
            ? ["0px 0px 40px var(--theme-color-1)", "0px 0px 80px var(--theme-color-2)", "0px 0px 40px var(--theme-color-1)"]
            : "0px 0px 20px rgba(255,255,255,0.1)",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-5xl font-bold text-white text-glow">
          A
        </span>
      </motion.div>
    </div>
  );
};

export default AIAvatar;

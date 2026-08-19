import React from 'react';
import { motion } from 'framer-motion';

const AIAvatar = ({ isSpeaking }) => {
  return (
    <div className="relative flex items-center justify-center p-8">
      {/* Outer Glow / Ripple Effect */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-teal-500/50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </>
      )}

      {/* Core Avatar */}
      <motion.div 
        className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]
                    bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10`}
        animate={{
          boxShadow: isSpeaking 
            ? ["0px 0px 40px rgba(16,185,129,0.3)", "0px 0px 80px rgba(20,184,166,0.5)", "0px 0px 40px rgba(16,185,129,0.3)"]
            : "0px 0px 20px rgba(16,185,129,0.1)",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
          A
        </span>
      </motion.div>
    </div>
  );
};

export default AIAvatar;

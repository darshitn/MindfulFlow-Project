import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

const BreathingView = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full mt-10 relative"
    >
      <div className="relative flex items-center justify-center w-full h-[300px] mb-8">
        
        {/* Unclipped Breathing Guide using absolute positioning without bounds */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute rounded-full border-2 border-cyan-300/30"
            style={{ width: 150, height: 150 }}
            animate={{ 
              scale: [1, 2.5, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-cyan-300/20"
            style={{ width: 150, height: 150 }}
            animate={{ 
              scale: [1, 3, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute rounded-full bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            style={{ width: 150, height: 150 }}
            layoutId="timer-ring" // Morph from timer ring
            animate={{ 
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wind className="w-12 h-12 text-cyan-200" />
          </motion.div>
        </div>
      </div>

      <div className="glass-panel p-8 flex flex-col items-center text-center w-full max-w-md z-10">
        <h2 className="text-2xl font-light tracking-wide mb-2 text-white">Breathe</h2>
        <p className="text-white/60 leading-relaxed text-sm">
          Follow the expanding rings.<br/>Inhale for 4s, exhale for 4s.
        </p>
      </div>
    </motion.div>
  );
};

export default BreathingView;

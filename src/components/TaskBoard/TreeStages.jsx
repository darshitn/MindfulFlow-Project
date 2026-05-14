import { motion, AnimatePresence } from 'framer-motion';

const TreeStage1 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <motion.circle 
      cx="50" cy="80" r="5" 
      fill="rgba(103, 232, 249, 0.8)" 
      className="drop-shadow-[0_0_8px_rgba(103,232,249,1)]"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.2, 1], filter: ['blur(1px)', 'blur(2px)', 'blur(1px)'] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const TreeStage2 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <motion.path 
      d="M50,85 Q50,60 55,45" 
      stroke="rgba(103, 232, 249, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round"
      className="drop-shadow-[0_0_5px_rgba(103,232,249,0.8)]"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <motion.path 
      d="M55,45 Q65,40 65,50 Q60,55 55,45" 
      fill="rgba(52, 211, 153, 0.6)" stroke="rgba(52, 211, 153, 0.8)" strokeWidth="1"
      className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{ originX: '55px', originY: '45px' }}
    />
  </svg>
);

const TreeStage3 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <path 
      d="M50,85 Q48,50 50,30 M50,60 Q40,45 35,40 M50,50 Q60,35 65,30" 
      stroke="rgba(103, 232, 249, 0.8)" strokeWidth="4" fill="none" strokeLinecap="round"
      className="drop-shadow-[0_0_5px_rgba(103,232,249,0.6)]"
    />
    <path 
      d="M35,40 Q30,35 25,40 Q30,45 35,40" 
      fill="rgba(52, 211, 153, 0.6)" 
    />
    <path 
      d="M65,30 Q70,25 75,30 Q70,35 65,30" 
      fill="rgba(52, 211, 153, 0.6)" 
    />
    <path 
      d="M50,30 Q45,20 50,15 Q55,20 50,30" 
      fill="rgba(52, 211, 153, 0.6)" 
    />
  </svg>
);

const TreeStage4 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <path 
      d="M50,85 Q45,50 50,30 M50,65 Q35,50 30,40 M50,55 Q65,40 70,30" 
      stroke="rgba(103, 232, 249, 0.9)" strokeWidth="5" fill="none" strokeLinecap="round"
      className="drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]"
    />
    <motion.path 
      d="M50,10 C25,10 15,35 30,50 C20,60 40,70 50,60 C60,70 80,60 70,50 C85,35 75,10 50,10 Z" 
      fill="rgba(52, 211, 153, 0.3)" 
      stroke="rgba(52, 211, 153, 0.5)" strokeWidth="2"
      className="drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] backdrop-blur-sm"
      animate={{ 
        d: [
          "M50,10 C25,10 15,35 30,50 C20,60 40,70 50,60 C60,70 80,60 70,50 C85,35 75,10 50,10 Z",
          "M50,12 C28,10 18,35 32,50 C22,60 40,68 50,62 C60,68 78,60 68,50 C82,35 72,10 50,12 Z",
          "M50,10 C25,10 15,35 30,50 C20,60 40,70 50,60 C60,70 80,60 70,50 C85,35 75,10 50,10 Z"
        ]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const TreeStage5 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Trunk and heavy branches */}
    <path 
      d="M50,85 Q40,50 50,20 M50,70 Q25,50 20,40 M50,60 Q75,40 80,30 M50,45 Q35,30 30,20 M50,35 Q65,20 70,10" 
      stroke="rgba(103, 232, 249, 1)" strokeWidth="6" fill="none" strokeLinecap="round"
      className="drop-shadow-[0_0_8px_rgba(103,232,249,0.7)]"
    />
    
    {/* Massive Canopy */}
    <motion.path 
      d="M50,0 C15,0 0,35 20,55 C5,70 35,80 50,65 C65,80 95,70 80,55 C100,35 85,0 50,0 Z" 
      fill="rgba(52, 211, 153, 0.4)" 
      stroke="rgba(52, 211, 153, 0.8)" strokeWidth="2"
      className="drop-shadow-[0_0_20px_rgba(52,211,153,0.6)] backdrop-blur-md"
      animate={{ 
        d: [
          "M50,0 C15,0 0,35 20,55 C5,70 35,80 50,65 C65,80 95,70 80,55 C100,35 85,0 50,0 Z",
          "M50,2 C18,0 2,35 22,55 C8,70 35,78 50,67 C65,78 92,70 78,55 C98,35 82,0 50,2 Z",
          "M50,0 C15,0 0,35 20,55 C5,70 35,80 50,65 C65,80 95,70 80,55 C100,35 85,0 50,0 Z"
        ]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const BloomingParticles = () => {
  const particles = Array.from({ length: 8 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,1)]"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 50, 
            y: 50 
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: 50 + (Math.random() * 80 - 40),
            y: 30 + (Math.random() * 60 - 40)
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

const TreeStages = ({ stage, isBlooming }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={`stage-${stage}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {stage === 1 && <TreeStage1 />}
          {stage === 2 && <TreeStage2 />}
          {stage === 3 && <TreeStage3 />}
          {stage === 4 && <TreeStage4 />}
          {stage === 5 && <TreeStage5 />}
        </motion.div>
      </AnimatePresence>

      {isBlooming && stage === 5 && <BloomingParticles />}
    </div>
  );
};

export default TreeStages;

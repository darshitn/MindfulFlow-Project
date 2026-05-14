import { motion } from 'framer-motion';

const TimerDisplay = ({ timeLeft, duration, mode, theme, isDeepWork }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / duration;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  // Determine glow color based on mode and theme
  const isSpace = theme === 'deep-space';
  let glowColor;
  if (isSpace) {
    glowColor = mode === 'work' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)';
  } else {
    glowColor = mode === 'work' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(20, 184, 166, 0.8)';
  }
  
  return (
    <motion.div 
      animate={
        isDeepWork 
          ? { scale: 1.1, y: ['15vh', '14vh', '15vh'] }
          : { scale: 1, y: [0, -10, 0] }
      }
      transition={{ 
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 1, ease: 'easeInOut' }
      }}
      className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10 h-[300px] mt-4 overflow-visible transform-gpu"
      style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      
      <div className="relative flex items-center justify-center w-[300px] h-[300px] rounded-full transform-gpu">
        
        {/* Static Glassmorphism Disk - Removed backdrop-blur to prevent recalculation */}
        <div 
          className="absolute inset-0 rounded-full bg-white/10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] pointer-events-none transform-gpu"
        />

        {/* Static Background Glow Rings - Replaced independent animations with static layers */}
        {[1, 2, 3].map((i) => (
          <div
            key={`pulse-${i}`}
            className="absolute inset-0 rounded-full border pointer-events-none transform-gpu"
            style={{ 
              boxShadow: `0 0 20px ${glowColor}, inset 0 0 20px ${glowColor}`,
              borderColor: glowColor,
              opacity: 0.15 * (4 - i),
              transform: `scale(${1 + i * 0.15})`
            }}
          />
        ))}

        {/* SVG Progress Ring */}
        <svg 
          viewBox="0 0 340 340"
          shapeRendering="geometricPrecision"
          className="absolute w-[340px] h-[340px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none overflow-visible transform-gpu"
        >
          <circle
            cx="170"
            cy="170"
            r={radius}
            className="stroke-white/10"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Only the stroke updates here, no filter animations */}
          <motion.circle
            cx="170"
            cy="170"
            r={radius}
            className="stroke-white transform-gpu"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              filter: isDeepWork 
                ? `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 0 60px ${glowColor})`
                : `drop-shadow(0 0 15px ${glowColor}) drop-shadow(0 0 30px ${glowColor})`
            }}
            animate={{ strokeDashoffset }}
            transition={{ strokeDashoffset: { type: "tween", ease: "linear", duration: 1 } }}
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Text Container - Static div, no key, text-rendering optimized */}
        <div className="absolute flex flex-col items-center justify-center w-full h-full z-10 pointer-events-none transform-gpu">
          <div
            className="text-7xl font-bold tracking-widest text-white drop-shadow-md tabular-nums antialiased"
            style={{ WebkitFontSmoothing: 'antialiased', fontVariantNumeric: 'tabular-nums', textRendering: 'optimizeLegibility' }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="mt-2 text-sm font-medium text-white/70 uppercase tracking-widest drop-shadow-sm antialiased" style={{ WebkitFontSmoothing: 'antialiased' }}>
            {mode === 'work' ? 'Focus Session' : 'Break Time'}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default TimerDisplay;

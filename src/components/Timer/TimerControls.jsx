import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '../../hooks/useMagneticHover';

const MagneticButton = ({ children, onClick, title, className, strength = 0.5 }) => {
  const { ref, controls } = useMagneticHover(strength);
  
  return (
    <motion.button
      ref={ref}
      animate={controls}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={className}
      title={title}
    >
      {children}
    </motion.button>
  );
};

const TimerControls = ({ isRunning, onToggle, onReset, onSkip }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      <MagneticButton
        onClick={onReset}
        className="p-4 rounded-full glass-panel hover:bg-white/10 transition-colors"
        title="Reset Timer"
        strength={0.3}
      >
        <RotateCcw className="w-6 h-6 text-white" />
      </MagneticButton>

      <MagneticButton
        onClick={onToggle}
        className="flex items-center justify-center w-20 h-20 rounded-full glass-panel hover:bg-white/10 transition-colors"
        strength={0.6}
      >
        {isRunning ? (
          <Pause className="w-8 h-8 text-white fill-current" />
        ) : (
          <Play className="w-8 h-8 text-white fill-current ml-1" />
        )}
      </MagneticButton>

      <MagneticButton
        onClick={onSkip}
        className="p-4 rounded-full glass-panel hover:bg-white/10 transition-colors"
        title="Skip Session"
        strength={0.3}
      >
        <FastForward className="w-6 h-6 text-white fill-current" />
      </MagneticButton>
    </div>
  );
};

export default TimerControls;

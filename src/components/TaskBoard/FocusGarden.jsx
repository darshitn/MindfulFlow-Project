import { motion } from 'framer-motion';
import TreeSkeleton from './TreeSkeleton';

const FocusGarden = ({ sessions, timeLeft, duration, isRunning, mode }) => {
  // Only render seeds/plants for work sessions
  const workSessions = sessions.filter(s => s.mode === 'work');
  
  // Growth Engine Logic for active session
  const isWorking = mode === 'work';
  const completionProgress = isWorking && duration > 0 ? 1 - (timeLeft / duration) : 0;

  // Render previously completed sessions as mature trees
  return (
    <div className="w-full max-w-md mx-auto mt-8 relative z-0 h-56 glass-panel overflow-hidden border-white/20">
      <div className="absolute top-2 left-4 text-xs font-semibold tracking-widest text-white/50 uppercase">
        Focus Garden
      </div>
      
      {/* Active Growing Plant */}
      {isWorking && (isRunning || completionProgress > 0) && (
        <motion.div
          className="absolute z-10 w-32 h-32 pointer-events-none"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            left: '50%',
            bottom: '15%',
            marginLeft: '-4rem', // Half of w-32 (64px)
          }}
        >
          <TreeSkeleton completionProgress={completionProgress} />
        </motion.div>
      )}

      {/* Garden History */}
      {workSessions.length === 0 && !isWorking ? (
        <div className="flex items-center justify-center h-full text-white/30 text-sm italic">
          Complete a work session to plant a seed.
        </div>
      ) : (
        workSessions.map((session, i) => {
          // Use session ID to seed random positions so they stay consistent
          const seed = session.id || i;
          const randomX = (seed % 90) + 5; // 5-95%
          const randomScale = 0.8 + ((seed % 40) / 100); // 0.8 - 1.2
          const isFlipped = seed % 2 === 0;

          return (
            <motion.div
              key={session.id}
              className="absolute w-24 h-24 opacity-80"
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 0.8, 
                y: [0, -5, 0],
              }}
              transition={{
                y: { duration: 5 + (seed % 3), repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1 }
              }}
              style={{
                left: `${randomX}%`,
                bottom: '15%',
                transform: `scale(${randomScale}) ${isFlipped ? 'scaleX(-1)' : ''}`,
                transformOrigin: 'bottom center',
                marginLeft: '-3rem' // Half of w-24
              }}
            >
              <TreeSkeleton completionProgress={1} />
            </motion.div>
          );
        })
      )}
      
      {/* Ground plane glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[50%] bg-cyan-900/40 blur-2xl rounded-[100%]" />
    </div>
  );
};

export default FocusGarden;

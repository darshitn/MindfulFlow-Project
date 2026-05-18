import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Meh, CloudRain } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 'Focused', icon: Target, label: 'Focused', color: 'text-cyan-400', bg: 'hover:bg-cyan-400/20' },
  { id: 'Neutral', icon: Meh, label: 'Neutral', color: 'text-gray-300', bg: 'hover:bg-gray-300/20' },
  { id: 'Distracted', icon: CloudRain, label: 'Distracted', color: 'text-indigo-400', bg: 'hover:bg-indigo-400/20' }
];

const CompletionModal = ({ isOpen, activeTask, onCompleteSession }) => {
  const [selectedMood, setSelectedMood] = useState('Neutral');

  useEffect(() => {
    if (isOpen) {
      // Trigger Celebration Confetti with lower z-index than the modal
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#818cf8', '#facc15', '#ffffff'],
        zIndex: 40
      });
      setSelectedMood('Neutral'); // Reset mood on open
    }
  }, [isOpen]);

  const handleSubmit = (completed) => {
    onCompleteSession(completed ? activeTask?.id : null, selectedMood);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="completion-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, filter: 'blur(10px)', scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md pointer-events-auto z-[110]"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                boxShadow: ['0 0 0px rgba(34,211,238,0)', '0 0 40px rgba(34,211,238,0.3)', '0 0 0px rgba(34,211,238,0)']
              }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="w-full glass-panel p-8 flex flex-col items-center text-center shadow-2xl border-white/20"
            >
              {/* Focus Milestone Badge */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  boxShadow: ['inset 0 0 10px rgba(34,211,238,0.2)', 'inset 0 0 30px rgba(34,211,238,0.5)', 'inset 0 0 10px rgba(34,211,238,0.2)'],
                  filter: ['drop-shadow(0 0 10px rgba(34,211,238,0.3))', 'drop-shadow(0 0 25px rgba(34,211,238,0.7))', 'drop-shadow(0 0 10px rgba(34,211,238,0.3))']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-white/20 flex items-center justify-center mb-6 pointer-events-none"
              >
                <Trophy className="w-12 h-12 text-cyan-300 drop-shadow-lg" />
              </motion.div>

            <h2 className="text-3xl font-light tracking-wide mb-1 text-white pointer-events-none">Great Job!</h2>
            <p className="text-cyan-200/80 font-medium tracking-widest uppercase text-xs mb-8 pointer-events-none">Focus Milestone Achieved</p>

            {/* Mood Tracker */}
            <div className="w-full mb-8 relative z-50">
              <p className="text-white/60 text-sm mb-3 pointer-events-none">How was your focus?</p>
              <div className="flex justify-center gap-3 relative z-50">
                {MOODS.map(mood => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  return (
                    <motion.button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 relative z-50 ${mood.bg} ${isSelected ? 'bg-white/10 ring-1 ring-white/30' : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Icon className={`w-6 h-6 ${mood.color} pointer-events-none`} />
                      <span className="text-[10px] uppercase tracking-wider text-white/80 pointer-events-none">{mood.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Task Action */}
            {activeTask ? (
              <div className="w-full border-t border-white/10 pt-6 relative z-50">
                <p className="text-white/80 text-sm mb-4 pointer-events-none">
                  Did you finish: <span className="font-semibold text-white">"{activeTask.title}"</span>?
                </p>
                <div className="flex flex-col gap-3 relative z-50">
                  <motion.button
                    onClick={() => handleSubmit(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-50 w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl font-medium text-cyan-100 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  >
                    Yes, mark as Done
                  </motion.button>
                  <motion.button
                    onClick={() => handleSubmit(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-50 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 transition-colors"
                  >
                    No, keep working
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="w-full border-t border-white/10 pt-6 flex flex-col gap-3 relative z-50">
                <p className="text-white/80 text-sm mb-2 pointer-events-none">Great job! Keep the momentum going.</p>
                <motion.button
                  onClick={() => handleSubmit(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-50 w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl font-medium text-cyan-100 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                >
                  Continue
                </motion.button>
              </div>
            )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default CompletionModal;

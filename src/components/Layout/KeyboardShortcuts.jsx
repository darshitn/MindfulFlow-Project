import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KeyboardShortcuts = ({ onToggle, onReset, onZenToggle }) => {
  const [ghostKey, setGhostKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      let keyToGhost = null;

      if (e.code === 'Space') {
        e.preventDefault();
        onToggle();
        keyToGhost = 'SPACE';
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        onReset();
        keyToGhost = 'R';
      } else if (e.code === 'KeyZ') {
        e.preventDefault();
        onZenToggle();
        keyToGhost = 'Z';
      }

      if (keyToGhost) {
        setGhostKey(keyToGhost);
        setTimeout(() => setGhostKey(null), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, onReset, onZenToggle]);

  return (
    <AnimatePresence>
      {ghostKey && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1.2 }}
          exit={{ opacity: 0, y: -60, filter: 'blur(10px)', scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] pointer-events-none"
        >
          <div className="px-6 py-4 rounded-2xl glass-panel border border-white/30 text-white font-bold text-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {ghostKey}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { sendNotification } from '../../utils/notification';

const WellnessAlert = ({ isRunning }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    const TWENTY_MINUTES_SEC = 20 * 60; // 1200 seconds

    if (isRunning) {
      interval = setInterval(() => {
        setActiveSeconds(prev => {
          const next = prev + 1;
          if (next >= TWENTY_MINUTES_SEC) {
            setShowAlert(true);
            sendNotification('Wellness Micro-Break', '20-20-20 Rule: Time to look 20 feet away for 20 seconds.');
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <AnimatePresence>
      {showAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissAlert}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 flex flex-col items-center text-center shadow-2xl border-cyan-400/30"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-400/20 flex items-center justify-center mb-6">
              <Eye className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
            </div>
            
            <h2 className="text-2xl font-light tracking-wide mb-3 text-white">20-20-20 Micro-Break</h2>
            
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              To prevent eye strain, look at something at least <span className="text-cyan-300 font-semibold">20 feet away</span> for <span className="text-cyan-300 font-semibold">20 seconds</span>.
            </p>
            
            <button 
              onClick={dismissAlert}
              className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors text-white text-lg tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              I'm back, refreshed!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WellnessAlert;

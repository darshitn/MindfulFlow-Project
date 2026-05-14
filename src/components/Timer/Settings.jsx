import { Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sendNotification, requestPermission } from '../../utils/notification';

const Settings = ({ workDuration, breakDuration, onUpdateSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempWork, setTempWork] = useState(workDuration / 60);
  const [tempBreak, setTempBreak] = useState(breakDuration / 60);
  
  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true' && Notification.permission === 'granted';
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state if permission changes externally
  useEffect(() => {
    if (Notification.permission === 'denied' && notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  }, [isOpen, notificationsEnabled]);

  const handleSave = () => {
    onUpdateSettings(tempWork * 60, tempBreak * 60);
    setIsOpen(false);
  };

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      return;
    }

    if (Notification.permission === 'denied') {
      setToastMessage("Notifications are blocked in your browser settings. Please enable them to receive alerts.");
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }

    const granted = await requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      sendNotification('MindfulFlow', 'Alerts successfully enabled!');
    } else {
      setNotificationsEnabled(false);
      setToastMessage("Notifications were denied. You can re-enable them in browser settings.");
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  return (
    <div className="relative mt-8 z-20">
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 transition-colors text-sm"
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 w-72 p-6 glass-panel flex flex-col gap-5 mt-2"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">
                Work Duration (min)
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={tempWork}
                onChange={(e) => setTempWork(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="text-right text-sm mt-1">{tempWork} min</div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">
                Break Duration (min)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={tempBreak}
                onChange={(e) => setTempBreak(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="text-right text-sm mt-1">{tempBreak} min</div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-2">
              <label className="text-xs uppercase tracking-wider text-white/70">
                Browser Alerts
              </label>
              <button
                onClick={handleToggleNotifications}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  notificationsEnabled ? 'bg-cyan-400/80' : 'bg-white/10'
                }`}
              >
                <motion.div
                  layout
                  className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  animate={{
                    x: notificationsEnabled ? 24 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium mt-2"
            >
              Save Settings
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 glass-panel border border-red-400/30 text-red-100 text-sm max-w-sm text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {toastMessage}
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;

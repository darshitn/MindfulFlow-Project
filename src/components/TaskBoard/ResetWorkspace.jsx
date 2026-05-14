import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const ResetWorkspace = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-12 flex justify-center relative z-10">
      <AnimatePresence mode="wait">
        {!showConfirm ? (
          <motion.button
            key="reset-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white/60 hover:text-red-300 glass-panel hover:bg-red-500/10 transition-colors shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Workspace
          </motion.button>
        ) : (
          <motion.div
            key="confirm-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 glass-panel px-6 py-3 border-red-500/30 bg-red-500/10 shadow-lg"
          >
            <span className="text-sm font-medium text-white/80">Are you sure?</span>
            <button
              onClick={() => {
                onReset();
                setShowConfirm(false);
              }}
              className="px-3 py-1.5 text-sm font-medium text-red-300 hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              Yes, Clear All
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetWorkspace;

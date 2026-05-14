import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle2 } from 'lucide-react';

const SessionHistory = ({ sessions }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-12 p-4 sm:p-6 glass-panel relative z-10">
      <div className="flex items-center gap-2 mb-4 sm:mb-6 text-white/80 border-b border-white/10 pb-4">
        <History className="w-5 h-5" />
        <h2 className="text-lg font-medium tracking-wide">Session History</h2>
      </div>

      <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
        <AnimatePresence initial={false}>
          {sessions.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              className="text-center text-white/50 text-sm py-4 italic"
            >
              No sessions completed yet. Start focusing!
            </motion.p>
          ) : (
            sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -50, filter: 'blur(10px)', scale: 0.9, rotate: 5 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 flex-wrap gap-2"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.goal || (session.mode === 'work' ? 'Focus Session' : 'Break')}</span>
                    <span className="text-xs text-white/60">
                      {session.mode === 'work' ? 'Work' : 'Break'} • {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-mono text-white/80 shrink-0">
                  {session.duration} min
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SessionHistory;

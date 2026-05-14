import { motion } from 'framer-motion';

const TABS = [
  { id: 'pomodoro', label: 'Timer' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'analytics', label: 'Analytics' }
];

const Navigation = ({ currentView, onViewChange }) => {
  return (
    <nav className="flex justify-center mb-12 z-20">
      <div className="glass-panel p-1 flex gap-2 rounded-full relative">
        {TABS.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-white/20 rounded-full z-[-1] shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

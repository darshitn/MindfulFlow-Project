import { motion } from 'framer-motion';

const PRESETS = [
  { label: '25 min', value: 25 },
  { label: '15 min', value: 15 },
  { label: '5 min', value: 5 },
];

const TimerPresets = ({ activePreset, onSelect }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-4 relative z-20">
      {PRESETS.map((preset) => {
        const isActive = activePreset === preset.value;

        return (
          <motion.button
            key={preset.value}
            onClick={() => onSelect(preset.value)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
            whileHover={{ y: isActive ? -5 : -2 }}
            animate={{ y: isActive ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isActive && (
              <motion.div
                layoutId="presetHighlight"
                className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/20 z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{preset.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TimerPresets;

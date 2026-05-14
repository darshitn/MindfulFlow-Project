import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Waves, Volume2, Volume1, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 'rain', name: 'Rain', icon: CloudRain, url: '/audio/rain.mp3' },
  { id: 'ambient', name: 'Ambient', icon: Wind, url: '/audio/ambient.mp3' },
  { id: 'waves', name: 'Waves', icon: Waves, url: '/audio/waves.mp3' }
];

// PROPS: isRunning (boolean to track timer state), mode (string for current theme)
const AudioController = ({ isRunning, mode, activeTrack, setActiveTrack, volume, setVolume }) => {
  // STATE: Local state for UI
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  const toggleTrack = (trackId) => {
    setActiveTrack(prev => prev === trackId ? null : trackId);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };
  const VolumeIcon = getVolumeIcon();

  // Glow color based on mode
  const glowColor = mode === 'work' ? 'rgba(103,232,249,0.8)' : 'rgba(52,211,153,0.8)';
  const accentColor = mode === 'work' ? 'bg-cyan-400' : 'bg-green-400';

  return (
    <motion.div 
      className="fixed left-4 top-1/2 -translate-y-1/2 glass-panel p-3 flex flex-col gap-4 z-40 shadow-xl"
      animate={{ y: ['-50%', '-52%', '-48%', '-50%'] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Track Selection */}
      <div className="flex flex-col gap-3 items-center">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;
          
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-transparent hover:bg-white/10 text-white/50 hover:text-white/80'
              }`}
              title={track.name}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Floating Volume Dock */}
      <AnimatePresence>
        {activeTrack && (
          <div 
            className="relative flex flex-col items-center pt-3 border-t border-white/10"
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            <AnimatePresence>
              {isHoveringVolume && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute bottom-12 mb-2 glass-panel p-3 rounded-2xl flex flex-col items-center gap-2 shadow-2xl"
                >
                  <div className="relative w-2 h-24 bg-black/40 rounded-full overflow-hidden flex items-end">
                    {/* The Fill */}
                    <motion.div 
                      className={`w-full ${accentColor}`}
                      style={{ height: `${volume * 100}%`, boxShadow: `0 0 10px ${glowColor}` }}
                      layout
                    />
                    {/* Invisible Range Slider layered on top (rotated horizontal slider for perfect direction mapping) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="opacity-0 cursor-pointer m-0"
                        style={{ width: '96px', height: '8px', transform: 'rotate(-90deg)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always visible volume button when track is active */}
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <VolumeIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AudioController;

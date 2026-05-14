import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Waves, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 'rain', name: 'Rain', icon: CloudRain, url: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg' },
  { id: 'ambient', name: 'Ambient', icon: Wind, url: 'https://actions.google.com/sounds/v1/weather/wind_howl.ogg' },
  { id: 'waves', name: 'Waves', icon: Waves, url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg' }
];

const SoundscapeManager = ({ isRunning }) => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  
  // Use distinct refs for each track
  const audioRefs = useRef({});

  // Initialize audio objects once
  useEffect(() => {
    TRACKS.forEach(track => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audioRefs.current[track.id] = audio;
      }
    });

    // Cleanup on unmount (e.g. switching to Breathing tab)
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
      });
    };
  }, []);

  // Sync volume to all tracks
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  // Handle play/pause based on active track and timer state
  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id === activeTrack && isRunning) {
        audio.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audio.pause();
      }
    });
  }, [activeTrack, isRunning]);

  // Handle window blur (tab switch)
  useEffect(() => {
    const handleBlur = () => {
      if (activeTrack && audioRefs.current[activeTrack] && !audioRefs.current[activeTrack].paused) {
        audioRefs.current[activeTrack].pause();
      }
    };

    const handleFocus = () => {
      if (isRunning && activeTrack && audioRefs.current[activeTrack]) {
        audioRefs.current[activeTrack].play().catch(e => console.log("Audio play blocked", e));
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isRunning, activeTrack]);

  const toggleTrack = (trackId) => {
    setActiveTrack(prev => prev === trackId ? null : trackId);
  };

  return (
    <motion.div 
      className="fixed left-4 top-1/2 -translate-y-1/2 glass-panel p-3 flex flex-col gap-4 z-40 shadow-xl"
      animate={{ y: ['-50%', '-52%', '-48%', '-50%'] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
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

      <AnimatePresence>
        {activeTrack && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-2 pt-3 border-t border-white/10"
          >
            <Volume2 className="w-4 h-4 text-white/70" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              style={{ writingMode: 'vertical-lr' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SoundscapeManager;

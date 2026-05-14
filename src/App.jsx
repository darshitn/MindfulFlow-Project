import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Palette } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Layout/Navigation';
import FloatingBackground from './components/Layout/FloatingBackground';
import WellnessAlert from './components/Layout/WellnessAlert';
import PomodoroView from './views/PomodoroView';
import BreathingView from './views/BreathingView';
import AnalyticsView from './views/AnalyticsView';
import AudioController from './components/Timer/AudioController';
import KeyboardShortcuts from './components/Layout/KeyboardShortcuts';
import useTimer from './hooks/useTimer';
import './index.css';

const TRACKS = [
  { id: 'rain', url: '/audio/rain.mp3' },
  { id: 'ambient', url: '/audio/ambient.mp3' },
  { id: 'waves', url: '/audio/waves.mp3' }
];

function App() {
  const [currentView, setCurrentView] = useState('pomodoro');
  const timerState = useTimer('work');
  const { mode, isRunning, handleToggle, handleReset, isDeepWork, setIsDeepWork } = timerState;
  
  // STATE: Audio state hoisted to root
  const [activeTrack, setActiveTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  
  // USE_REF: Persistent reference to Audio objects
  const audioRefs = useRef({});

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('appTheme') || 'deep-space';
  });

  // EFFECT: Initialize audio objects once on mount
  useEffect(() => {
    TRACKS.forEach(track => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audioRefs.current[track.id] = audio;
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
      });
    };
  }, []);

  // EFFECT: Sync volume to all tracks
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  // EFFECT: Handle play/pause based on active track and timer state
  // Page Visibility API ensures it doesn't pause when tab is hidden
  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id === activeTrack && isRunning) {
        audio.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audio.pause();
        if (id !== activeTrack) {
          audio.currentTime = 0;
        }
      }
    });
  }, [activeTrack, isRunning]);

  // Update body class for dynamic background based on mode and theme
  useEffect(() => {
    document.body.className = `theme-${theme} mode-${mode} ${isDeepWork ? 'zen-mode' : ''}`;
    localStorage.setItem('appTheme', theme);
  }, [mode, theme, isDeepWork]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'deep-space' ? 'serene-forest' : 'deep-space');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col relative py-8 sm:py-12 px-4 selection:bg-white/20 relative z-0">
      <CustomCursor />
      <WellnessAlert isRunning={isRunning} />
      <KeyboardShortcuts 
        onToggle={handleToggle} 
        onReset={handleReset} 
        onZenToggle={() => setIsDeepWork(prev => !prev)} 
      />
      
      {/* Global Audio Controller ensuring persistence across views */}
      <AnimatePresence>
        {!isDeepWork && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}>
            <AudioController 
              isRunning={isRunning} 
              mode={mode} 
              activeTrack={activeTrack}
              setActiveTrack={setActiveTrack}
              volume={volume}
              setVolume={setVolume}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Blobs Background */}
      <FloatingBackground mode={mode} theme={theme} />
      
      {/* Theme Switcher */}
      <AnimatePresence>
        {!isDeepWork && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleTheme}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-full glass-panel hover:bg-white/10 transition-colors z-50 text-white flex items-center gap-2"
            title="Toggle Theme"
          >
            <Palette className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isDeepWork && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, height: 0, overflow: 'hidden', margin: 0 }} 
              className="mb-12 text-center mt-4"
            >
              <h1 className="text-3xl font-light tracking-widest text-white drop-shadow-sm mb-2">MINDFUL<span className="font-semibold">FLOW</span></h1>
              <p className="text-white/60 text-sm tracking-wide">Elevate your productivity</p>
            </motion.header>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isDeepWork && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}>
              <Navigation currentView={currentView} onViewChange={setCurrentView} />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="w-full relative flex flex-col items-center justify-center">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              {currentView === 'pomodoro' && (
                <PomodoroView 
                  key="pomodoro" 
                  {...timerState} 
                  theme={theme}
                  activeTrack={activeTrack}
                  volume={volume}
                />
              )}
              {currentView === 'breathing' && (
                <BreathingView 
                  key="breathing" 
                  theme={theme}
                  activeTrack={activeTrack}
                  volume={volume}
                />
              )}
              {currentView === 'analytics' && (
                <AnalyticsView key="analytics" />
              )}
            </AnimatePresence>
          </LayoutGroup>
        </main>
      </div>

      {/* Static Decorative background elements - kept minimal to let blobs shine */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl pointer-events-none mix-blend-screen z-[-2]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-3xl pointer-events-none mix-blend-screen z-[-2]" />
    </div>
  );
}

export default App;

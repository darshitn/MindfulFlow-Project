import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sendNotification } from '../utils/notification';

const useTimer = (initialMode = 'work') => {
  const [mode, setMode] = useState(initialMode);
  
  const [workDuration, setWorkDuration] = useState(() => {
    const saved = localStorage.getItem('workDuration');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });
  
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem('breakDuration');
    return saved ? parseInt(saved, 10) : 5 * 60;
  });
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('pomodoroSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pomodoroTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const prevLevelRef = useRef(null);
  
  // Page Visibility Timestamp ref
  const lastTickRef = useRef(null);

  // Gamification: Calculate Level
  const totalFocusTime = sessions
    .filter(s => s.mode === 'work')
    .reduce((acc, curr) => acc + curr.duration, 0);
  const userLevel = Math.floor(totalFocusTime / 60) + 1;

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('workDuration', workDuration);
    localStorage.setItem('breakDuration', breakDuration);
  }, [workDuration, breakDuration]);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Level Up Confetti Logic
  useEffect(() => {
    if (prevLevelRef.current !== null && userLevel > prevLevelRef.current) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
          colors: ['#22d3ee', '#34d399', '#818cf8']
        });
        confetti({
          particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
          colors: ['#22d3ee', '#34d399', '#818cf8']
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    prevLevelRef.current = userLevel;
  }, [userLevel]);

  // Audio Notification
  const playNotification = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); 
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio API not supported', e);
    }
  };

  // Core Timer Logic with Page Visibility API
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      lastTickRef.current = Date.now();
      
      interval = setInterval(() => {
        const now = Date.now();
        // Calculate elapsed time (usually ~1000ms, but larger if backgrounded)
        const elapsedMs = now - lastTickRef.current;
        const elapsedSeconds = Math.round(elapsedMs / 1000);
        
        if (elapsedSeconds >= 1) {
          setTimeLeft(prev => {
            const nextTime = prev - elapsedSeconds;
            if (nextTime <= 0) {
              clearInterval(interval);
              playNotification();
              sendNotification('Focus Session Complete!', 'Your MindfulFlow session has ended.');
              setIsRunning(false);
              setShowCompletionModal(true);
              return 0;
            }
            return nextTime;
          });
          lastTickRef.current = now;
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playNotification();
      sendNotification('Focus Session Complete!', 'Your MindfulFlow session has ended.');
      setIsRunning(false);
      setShowCompletionModal(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Background persistence
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && lastTickRef.current) {
        // Catch up timer when returning from background
        const now = Date.now();
        const elapsedMs = now - lastTickRef.current;
        const elapsedSeconds = Math.round(elapsedMs / 1000);
        
        setTimeLeft(prev => {
          const nextTime = prev - elapsedSeconds;
          if (nextTime <= 0) {
            playNotification();
            sendNotification('Focus Session Complete!', 'Your MindfulFlow session has ended.');
            setIsRunning(false);
            setShowCompletionModal(true);
            return 0;
          }
          return nextTime;
        });
        lastTickRef.current = now;
      } else if (document.visibilityState === 'hidden' && isRunning) {
        lastTickRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning && timeLeft > 0) {
      setTimeLeft(mode === 'work' ? workDuration : breakDuration);
    }
  }, [workDuration, breakDuration, mode]);

  const handleSessionComplete = (completedTaskId = null, mood = 'Neutral') => {
    const activeTask = tasks.find(t => !t.completed);
    const newSession = {
      id: Date.now(),
      mode,
      duration: mode === 'work' ? workDuration / 60 : breakDuration / 60,
      timestamp: new Date().toISOString(),
      goal: activeTask ? activeTask.title : 'General Focus',
      mood: mood
    };
    
    setSessions(prev => [newSession, ...prev]);

    if (completedTaskId) {
      setTasks(prev => prev.map(t => t.id === completedTaskId ? { ...t, completed: true } : t));
    }
    
    setShowCompletionModal(false);
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? workDuration : breakDuration);
  };

  const handleToggle = () => {
    if (!isRunning) lastTickRef.current = Date.now();
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const handleSkip = () => {
    playNotification();
    setIsRunning(false);
    setShowCompletionModal(true);
  };

  const handleUpdateSettings = (newWork, newBreak) => {
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
  };

  const handlePresetSelect = (minutes) => {
    setWorkDuration(minutes * 60);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setMode('work');
  };

  const handleResetWorkspace = () => {
    setSessions([]);
    localStorage.removeItem('pomodoroSessions');
    setTasks(prev => {
      const uncompleted = prev.filter(t => !t.completed);
      localStorage.setItem('pomodoroTasks', JSON.stringify(uncompleted));
      return uncompleted;
    });
  };

  const [isDeepWork, setIsDeepWork] = useState(false);

  return {
    mode, setMode,
    workDuration, breakDuration,
    sessions, setSessions,
    tasks, setTasks,
    timeLeft, setTimeLeft,
    isRunning, setIsRunning,
    showCompletionModal, setShowCompletionModal,
    isDeepWork, setIsDeepWork,
    handleSessionComplete, handleToggle, handleReset,
    handleSkip, handleUpdateSettings, handlePresetSelect,
    handleResetWorkspace
  };
};

export default useTimer;

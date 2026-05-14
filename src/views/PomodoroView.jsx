import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import TimerDisplay from '../components/Timer/TimerDisplay';
import TimerControls from '../components/Timer/TimerControls';
import Settings from '../components/Timer/Settings';
import TimerPresets from '../components/Timer/TimerPresets';
import SessionHistory from '../components/TaskBoard/SessionHistory';
import TaskManager from '../components/TaskBoard/TaskManager';
import CompletionModal from '../components/TaskBoard/CompletionModal';
import FocusGarden from '../components/TaskBoard/FocusGarden';
import ResetWorkspace from '../components/TaskBoard/ResetWorkspace';

// PROPS: Timer states and handlers passed down from App.jsx's useTimer hook
const PomodoroView = ({ 
  mode, setMode, theme,
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
}) => {
  const activeTask = tasks.find(t => !t.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full relative transition-all duration-1000"
    >
      {/* Deep Work Toggle Button */}
      <motion.button
        layout
        onClick={() => setIsDeepWork(!isDeepWork)}
        className={
          isDeepWork
            ? "fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass-panel border border-cyan-400/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all z-[100] text-cyan-100 flex items-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-xl"
            : "absolute -top-16 right-0 p-3 rounded-full glass-panel hover:bg-white/10 transition-colors z-30 text-white flex items-center gap-2"
        }
        title="Toggle Deep Work Mode"
      >
        {isDeepWork ? <EyeOff className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> : <Eye className="w-5 h-5" />}
        <span className={`${isDeepWork ? 'inline' : 'hidden sm:inline'} text-xs font-medium uppercase tracking-widest`}>
          {isDeepWork ? 'Exit Zen' : 'Deep Work'}
        </span>
      </motion.button>

      <CompletionModal 
        isOpen={showCompletionModal} 
        activeTask={activeTask}
        onCompleteSession={handleSessionComplete}
      />

      <AnimatePresence>
        {!isDeepWork && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}>
            <TaskManager tasks={tasks} setTasks={setTasks} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isDeepWork && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          >
            <TimerPresets 
              activePreset={mode === 'work' ? workDuration / 60 : null}
              onSelect={handlePresetSelect} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TimerDisplay 
        timeLeft={timeLeft} 
        duration={mode === 'work' ? workDuration : breakDuration} 
        mode={mode} 
        theme={theme}
        isDeepWork={isDeepWork}
      />
      
      <AnimatePresence>
        {!isDeepWork && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}>
            <TimerControls 
              isRunning={isRunning} 
              onToggle={handleToggle} 
              onReset={handleReset} 
              onSkip={handleSkip} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {!isDeepWork && (
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Settings 
              workDuration={workDuration} 
              breakDuration={breakDuration} 
              onUpdateSettings={handleUpdateSettings} 
            />
            
            <FocusGarden 
              sessions={sessions} 
              timeLeft={timeLeft}
              duration={mode === 'work' ? workDuration : breakDuration}
              isRunning={isRunning}
              mode={mode}
            />
            
            <SessionHistory sessions={sessions} setSessions={setSessions} />
            <ResetWorkspace onReset={handleResetWorkspace} />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default PomodoroView;

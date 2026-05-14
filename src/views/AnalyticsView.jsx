import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Clock, Award } from 'lucide-react';

const AnalyticsView = () => {
  // Load sessions from localStorage
  const sessions = useMemo(() => {
    const saved = localStorage.getItem('pomodoroSessions');
    return saved ? JSON.parse(saved) : [];
  }, []);

  // Process data for the last 7 days
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      // Calculate total work duration for this day
      const daySessions = sessions.filter(s => {
        if (s.mode !== 'work') return false;
        const sessionDate = new Date(s.timestamp);
        return (
          sessionDate.getDate() === d.getDate() &&
          sessionDate.getMonth() === d.getMonth() &&
          sessionDate.getFullYear() === d.getFullYear()
        );
      });
      
      const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.duration, 0);
      
      data.push({
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: totalMinutes,
        date: d
      });
    }
    
    return data;
  }, [sessions]);

  // Process mood data
  const moodData = useMemo(() => {
    const durations = { Focused: 0, Neutral: 0, Distracted: 0 };
    
    sessions.forEach(s => {
      if (s.mode === 'work' && s.mood && durations[s.mood] !== undefined) {
        durations[s.mood] += s.duration;
      }
    });

    const maxDuration = Math.max(...Object.values(durations), 1);
    
    return [
      { mood: 'Focused', duration: durations.Focused, maxDuration, color: 'bg-cyan-400', shadow: '0 0 15px rgba(34,211,238,0.5)' },
      { mood: 'Neutral', duration: durations.Neutral, maxDuration, color: 'bg-gray-400', shadow: 'none' },
      { mood: 'Distracted', duration: durations.Distracted, maxDuration, color: 'bg-indigo-400', shadow: '0 0 15px rgba(129,140,248,0.4)' }
    ];
  }, [sessions]);

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60); // Ensure some scale even if empty
  const totalFocusTime = sessions
    .filter(s => s.mode === 'work')
    .reduce((acc, curr) => acc + curr.duration, 0);
  const userLevel = Math.floor(totalFocusTime / 60) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto mt-8 px-4"
    >
      <div className="w-full flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <BarChart className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-light tracking-wide text-white">Focus Analytics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
        {/* Total Time Stat */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col items-center text-center justify-center relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-10">
            <Clock className="w-32 h-32" />
          </div>
          <p className="text-white/60 uppercase tracking-widest text-xs font-semibold mb-2">Total Focus Time</p>
          <div className="text-4xl font-light text-white">
            {Math.floor(totalFocusTime / 60)}<span className="text-xl text-white/50">h</span> {totalFocusTime % 60}<span className="text-xl text-white/50">m</span>
          </div>
        </motion.div>

        {/* User Level Stat */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col items-center text-center justify-center relative overflow-hidden border-cyan-400/20"
        >
          <div className="absolute -left-4 -bottom-4 opacity-10">
            <Award className="w-32 h-32" />
          </div>
          <p className="text-cyan-200/60 uppercase tracking-widest text-xs font-semibold mb-2">Current Rank</p>
          <div className="text-4xl font-semibold text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">
            Lv. {userLevel}
          </div>
          <div className="w-full bg-black/20 h-1.5 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${(totalFocusTime % 60) / 60 * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-2 uppercase tracking-wide">
            {60 - (totalFocusTime % 60)} mins to next level
          </p>
        </motion.div>
      </div>

      {/* 7-Day Heatmap Chart */}
      <div className="w-full glass-panel p-6 sm:p-8">
        <h3 className="text-white/80 font-medium mb-6 text-sm uppercase tracking-widest">7-Day Activity Heatmap</h3>
        <div className="flex items-end justify-between h-48 gap-2 sm:gap-4">
          {chartData.map((data, idx) => {
            const heightPercent = (data.minutes / maxMinutes) * 100;
            // Determine heat color based on activity
            let barColor = "bg-white/20";
            let shadow = "none";
            if (data.minutes > 0) {
              barColor = "bg-cyan-400/60";
            }
            if (data.minutes > 60) {
              barColor = "bg-cyan-300";
              shadow = "0 0 15px rgba(34,211,238,0.6)";
            }

            return (
              <div key={idx} className="flex flex-col items-center w-full group">
                <div className="relative w-full flex justify-center h-full items-end pb-2">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {data.minutes} min
                  </div>
                  {/* Bar */}
                  <motion.div
                    className={`w-full max-w-[2rem] rounded-t-sm ${barColor}`}
                    style={{ boxShadow: shadow }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1, type: "spring", bounce: 0.3 }}
                  />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-2">
                  {data.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood Correlation Chart */}
      <div className="w-full glass-panel p-6 sm:p-8 mt-6 relative overflow-hidden mb-8">
        {/* Floating background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />
        
        <h3 className="text-white/80 font-medium mb-6 text-sm uppercase tracking-widest relative z-10">Focus vs. Mood</h3>
        <div className="flex items-end justify-around h-32 gap-4 relative z-10">
          {moodData.map((data) => {
            const heightPercent = data.duration > 0 ? (data.duration / data.maxDuration) * 100 : 2; // min height 2%
            return (
              <div key={data.mood} className="flex flex-col items-center w-full group">
                <div className="relative w-full flex justify-center h-full items-end pb-2">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {data.duration} min
                  </div>
                  {/* Bar */}
                  <motion.div
                    className={`w-full max-w-[3rem] rounded-t-lg ${data.color}`}
                    style={{ boxShadow: data.shadow }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-2">
                  {data.mood}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;

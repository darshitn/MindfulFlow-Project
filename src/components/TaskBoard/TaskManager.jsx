import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Circle, Star, GripVertical } from 'lucide-react';

const TaskManager = ({ tasks, setTasks }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    // Max 5 active tasks limit
    const activeTasks = tasks.filter(t => !t.completed);
    if (activeTasks.length >= 5) {
      alert("Let's focus on 5 tasks maximum at a time!");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: newTaskText.trim(),
      completed: false,
      starred: false,
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const toggleStar = (id) => {
    setTasks(prev => {
      // Find the task, toggle its star status
      const updatedTasks = prev.map(t => 
        t.id === id ? { ...t, starred: !t.starred } : t
      );
      
      // Separate completed and active
      const completed = updatedTasks.filter(t => t.completed);
      const active = updatedTasks.filter(t => !t.completed);
      
      // Sort active: starred first, then by original order
      active.sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        return 0; // maintain relative order
      });

      return [...active, ...completed];
    });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleReorder = (newActiveTasks) => {
    // We only reorder active tasks. Merge them back with completed tasks.
    setTasks(prev => {
      const completed = prev.filter(t => t.completed);
      return [...newActiveTasks, ...completed];
    });
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="w-full max-w-sm mx-auto mb-8 relative z-10">
      <form onSubmit={handleAddTask} className="relative mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors backdrop-blur-md shadow-lg"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Active Tasks - Reorderable */}
      <div className="space-y-2 mb-6">
        <Reorder.Group axis="y" values={activeTasks} onReorder={handleReorder} className="flex flex-col gap-2">
          <AnimatePresence>
            {activeTasks.map(task => (
              <Reorder.Item
                key={task.id}
                value={task}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, filter: 'blur(10px)', scale: 0.9 }}
                whileDrag={{ scale: 1.02, zIndex: 50, cursor: 'grabbing' }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                className={`group flex items-center justify-between p-3 glass-panel hover:bg-white/10 transition-all ${
                  task.starred ? 'shadow-[0_0_20px_rgba(250,204,21,0.2)] ring-1 ring-yellow-400/40 -translate-y-1 z-10 bg-yellow-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-white/30 hover:text-white/70 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button onClick={() => toggleTask(task.id)} className="group-hover:text-cyan-300 transition-colors">
                    <Circle className="w-4 h-4 text-white/50 hover:text-cyan-300" />
                  </button>
                  <span className={`text-sm font-medium ${task.starred ? 'text-yellow-100' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => toggleStar(task.id)}
                    className={`p-1 rounded transition-colors ${
                      task.starred ? 'text-yellow-400 opacity-100' : 'text-white/40 hover:bg-white/10 hover:text-yellow-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${task.starred ? 'fill-yellow-400' : ''}`} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      {/* Completed Pile */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 px-2">Completed Pile</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            <AnimatePresence>
              {completedTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -50, filter: 'blur(10px)', scale: 0.9, rotate: 5 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/10 border border-white/5"
                >
                  <div className="flex items-center gap-3 line-through text-white/50">
                    <CheckCircle className="w-4 h-4 text-green-400/50" />
                    <span className="text-sm">{task.title}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;


import React, { useState, useEffect, useMemo } from 'react';
import { Task } from '../types';

interface FocusModeScreenProps {
  tasks: Task[];
  onTaskComplete: (taskTitle: string) => void;
}

const FocusModeScreen: React.FC<FocusModeScreenProps> = ({ tasks, onTaskComplete }) => {
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks]);
  
  const [selectedTask, setSelectedTask] = useState(pendingTasks[0]?.title || '');
  const [duration, setDuration] = useState(25 * 60); // Default 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      if(selectedTask) {
        onTaskComplete(selectedTask);
      }
      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTaskComplete, selectedTask]);
  
  const handleDurationChange = (minutes: number) => {
    if (isActive) return;
    const newDuration = minutes * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsFinished(false);
  };

  const toggleTimer = () => {
    if (isFinished) {
      resetTimer();
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen animate-fade-in-up">
      <h1 className="text-2xl font-bold text-text-primary mb-4">Modo Foco</h1>
      
      <div className="mb-6 w-full max-w-xs">
          <label htmlFor="task-select" className="block text-sm font-medium text-text-secondary mb-1">
            Qual tarefa você vai focar?
          </label>
          <select
            id="task-select"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
            disabled={isActive}
          >
            {pendingTasks.length > 0 ? (
                pendingTasks.map(task => <option key={task.id} value={task.title}>{task.title}</option>)
            ) : (
                <option>Nenhuma tarefa pendente</option>
            )}
          </select>
      </div>
      
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-200" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className="text-primary"
            strokeWidth="5"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45) - ((timeLeft / duration) * (2 * Math.PI * 45))}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center">
            {isFinished ? (
                 <div className="text-center animate-fade-in-up">
                    <p className="text-4xl">🎉</p>
                    <p className="text-lg font-semibold text-text-primary mt-2">Parabéns!</p>
                </div>
            ) : (
                <span className="text-5xl font-bold text-text-primary tracking-wider">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            )}
        </div>
      </div>
      
      <div className="flex space-x-3 mb-8">
        {[10, 15, 25].map(min => (
          <button
            key={min}
            onClick={() => handleDurationChange(min)}
            disabled={isActive}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              duration === min * 60 && !isActive ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'
            } disabled:opacity-50`}
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-primary text-white font-bold py-3 px-12 rounded-lg hover:bg-primary-dark transition-colors duration-200 w-40 text-center"
        >
          {isFinished ? 'Reiniciar' : isActive ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={resetTimer} className="text-text-secondary hover:text-text-primary font-semibold">
          Resetar
        </button>
      </div>
    </div>
  );
};

export default FocusModeScreen;


import React, { useState } from 'react';
import { Task, Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import FocusModeScreen from './screens/FocusModeScreen';
import StatsScreen from './screens/StatsScreen';
import PremiumScreen from './screens/PremiumScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Revisar relatório trimestral', category: 'Trabalho', status: 'pending', duration: 25 },
    { id: 2, title: 'Aula de React Hooks', category: 'Estudo', status: 'pending', duration: 50 },
    { id: 3, title: 'Meditar por 10 minutos', category: 'Pessoal', status: 'completed', duration: 10 },
    { id: 4, title: 'Comprar mantimentos', category: 'Pessoal', status: 'pending', duration: 15 },
  ]);

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      status: 'pending',
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setScreen('home');
  };

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
          : task
      )
    );
  };
  
  const onTaskCompleteFocus = (taskTitle: string) => {
    setTasks(prevTasks => 
        prevTasks.map(task => 
            task.title.toLowerCase() === taskTitle.toLowerCase() && task.status === 'pending'
            ? { ...task, status: 'completed' }
            : task
        )
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen tasks={tasks} onToggleTask={toggleTaskStatus} onDeleteTask={deleteTask} onAddTask={() => setScreen('add_task')} />;
      case 'add_task':
        return <AddTaskScreen onAddTask={addTask} onBack={() => setScreen('home')} />;
      case 'focus_mode':
        return <FocusModeScreen tasks={tasks} onTaskComplete={onTaskCompleteFocus} />;
      case 'stats':
        return <StatsScreen tasks={tasks} />;
      case 'premium':
        return <PremiumScreen />;
      default:
        return <HomeScreen tasks={tasks} onToggleTask={toggleTaskStatus} onDeleteTask={deleteTask} onAddTask={() => setScreen('add_task')} />;
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans text-text-primary pb-24">
      <div className="max-w-lg mx-auto">
        {renderScreen()}
      </div>
      <BottomNav currentScreen={screen} setScreen={setScreen} />
    </div>
  );
};

export default App;

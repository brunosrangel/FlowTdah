
import React from 'react';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import { PlusIcon } from '../components/icons';

interface HomeScreenProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onAddTask: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ tasks, onToggleTask, onDeleteTask, onAddTask }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="p-4 animate-fade-in-up">
      <header className="flex items-center mb-6">
        <img src="https://picsum.photos/id/237/200/200" alt="User" className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="text-lg font-bold text-text-primary">Olá, Usuário 👋</p>
          <p className="text-sm text-text-secondary">Como vai sua energia hoje?</p>
        </div>
      </header>

      <main>
        <h2 className="text-xl font-bold text-text-primary mb-3">Suas Tarefas</h2>
        
        <section>
          <h3 className="font-semibold text-text-secondary mb-2">Hoje</h3>
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-white/60 rounded-lg">
              <p className="text-text-secondary">Nenhuma tarefa pendente. Bom trabalho!</p>
            </div>
          )}
        </section>

        {completedTasks.length > 0 && (
          <section className="mt-8">
            <h3 className="font-semibold text-text-secondary mb-2">Concluídas</h3>
            {completedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                style={{ animationDelay: `${(pendingTasks.length + index) * 100}ms` }}
              />
            ))}
          </section>
        )}
      </main>

      <button
        onClick={onAddTask}
        className="fixed bottom-20 right-5 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default HomeScreen;

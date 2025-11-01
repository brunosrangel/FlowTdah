
import React from 'react';
import { Task } from '../types';
import { TrashIcon, CheckCircleIcon, CircleIcon } from './icons';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  style?: React.CSSProperties;
}

const categoryColors = {
  Pessoal: 'bg-accent/20 text-accent/80',
  Trabalho: 'bg-secondary/20 text-secondary/80',
  Estudo: 'bg-primary/20 text-primary/80',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, style }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div
      style={style}
      className={`flex items-center bg-white p-4 rounded-xl shadow-sm mb-3 transition-all duration-300 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <button onClick={() => onToggle(task.id)} className="mr-4 flex-shrink-0">
        {isCompleted ? (
          <CheckCircleIcon className="text-primary" />
        ) : (
          <CircleIcon className="text-gray-300" />
        )}
      </button>
      <div className="flex-grow">
        <p className={`font-semibold text-text-primary ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            categoryColors[task.category]
          }`}
        >
          {task.category}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default TaskCard;

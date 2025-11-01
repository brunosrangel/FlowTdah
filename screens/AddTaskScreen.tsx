
import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeftIcon } from '../components/icons';

interface AddTaskScreenProps {
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onBack: () => void;
}

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ onAddTask, onBack }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Pessoal' | 'Trabalho' | 'Estudo'>('Pessoal');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      category,
      duration: duration ? parseInt(duration, 10) : undefined,
    });
  };

  return (
    <div className="p-4 animate-fade-in-up h-screen flex flex-col">
      <header className="relative flex items-center justify-center mb-6">
        <button onClick={onBack} className="absolute left-0 text-text-primary">
            <ChevronLeftIcon/>
        </button>
        <h1 className="text-xl font-bold text-text-primary">Criar Nova Tarefa</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Ex: Ler um capítulo do livro"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'Pessoal' | 'Trabalho' | 'Estudo')}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
          >
            <option>Pessoal</option>
            <option>Trabalho</option>
            <option>Estudo</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">
            Duração (minutos)
          </label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Opcional"
          />
        </div>
        
        <div className="mt-auto">
             <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Salvar Tarefa
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskScreen;

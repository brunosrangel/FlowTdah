import React, { useMemo } from 'react';
import { Task } from '../types';

interface StatsScreenProps {
    tasks: Task[];
}

const StatsScreen: React.FC<StatsScreenProps> = ({ tasks }) => {
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed').length, [tasks]);
    const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending').length, [tasks]);
    
    // Mock data for weekly progress
    const weeklyData = [
        { name: 'Seg', tasks: 4 },
        { name: 'Ter', tasks: 3 },
        { name: 'Qua', tasks: 5 },
        { name: 'Qui', tasks: 2 },
        { name: 'Sex', tasks: 6 },
        { name: 'Sáb', tasks: 1 },
        { name: 'Dom', tasks: 3 },
    ];
    
    const maxTasks = useMemo(() => Math.max(...weeklyData.map(d => d.tasks), 1), [weeklyData]);

    return (
        <div className="p-4 animate-fade-in-up">
            <header className="text-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Seu Progresso</h1>
                <p className="text-text-secondary mt-1">Visualize sua evolução semanal e conquistas.</p>
            </header>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <p className="text-3xl font-bold text-primary">{completedTasks}</p>
                    <p className="text-sm text-text-secondary">Tarefas Concluídas</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <p className="text-3xl font-bold text-secondary">{pendingTasks}</p>
                    <p className="text-sm text-text-secondary">Tarefas Pendentes</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h2 className="font-bold text-text-primary mb-4">Resumo da Semana</h2>
                <div className="w-full h-[250px] flex justify-around items-end pt-4 px-2 border-l border-b border-gray-200">
                    {weeklyData.map((day) => (
                        <div key={day.name} className="flex flex-col items-center h-full justify-end group w-1/7 text-center">
                             <div 
                                className="w-6 md:w-8 bg-primary rounded-t-md transition-all duration-300 group-hover:bg-primary-dark" 
                                style={{ height: `${(day.tasks / maxTasks) * 95}%` }}
                                title={`${day.tasks} tarefas`}
                            >
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-full font-bold">{day.tasks}</span>
                            </div>
                            <span className="text-xs text-text-secondary mt-2">{day.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsScreen;
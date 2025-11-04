import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import TaskItem from '../components/TaskItem';
import AdBanner from '../components/AdBanner';

const HomeScreen = () => {
    const { tasks, user, newlyAddedTaskId } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const filteredTasks = useMemo(() => {
        let items = [...tasks];

        if (filter !== 'all') {
            items = items.filter(task => (filter === 'completed' ? task.completed : !task.completed));
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === 'today') {
            const todayEnd = new Date(today);
            todayEnd.setDate(todayEnd.getDate() + 1);
            items = items.filter(task => {
                const targetDate = task.completed ? task.completedAt : task.dueDate;
                if (!targetDate) return false;
                const taskDate = new Date(targetDate);
                return taskDate >= today && taskDate < todayEnd;
            });
        } else if (dateFilter === 'this_week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);
            items = items.filter(task => {
                const targetDate = task.completed ? task.completedAt : task.dueDate;
                if (!targetDate) return false;
                const taskDate = new Date(targetDate);
                return taskDate >= weekStart && taskDate < weekEnd;
            });
        }

        return items;
    }, [tasks, filter, dateFilter]);

    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    return (
        <div className="screen">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1>Olá, {user.name}!</h1>
                    <p style={{ margin: 0 }}>Aqui está a sua lista de tarefas.</p>
                </div>
            </header>

            <div className="filter-group">
                <button className={filter === 'all' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilter('all')}>
                    Todas
                </button>
                <button className={filter === 'pending' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilter('pending')}>
                    Pendentes
                </button>
                <button className={filter === 'completed' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilter('completed')}>
                    Concluídas
                </button>
            </div>

            <div className="filter-group">
                <button className={dateFilter === 'all' ? 'btn-primary' : 'btn-secondary'} onClick={() => setDateFilter('all')}>
                    Tudo
                </button>
                <button className={dateFilter === 'today' ? 'btn-primary' : 'btn-secondary'} onClick={() => setDateFilter('today')}>
                    Hoje
                </button>
                <button className={dateFilter === 'this_week' ? 'btn-primary' : 'btn-secondary'} onClick={() => setDateFilter('this_week')}>
                    Esta Semana
                </button>
            </div>

            <div>
                {pendingTasks.length > 0 && <h3>Pendentes</h3>}
                {pendingTasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        isNew={task.id === newlyAddedTaskId}
                    />
                ))}

                {completedTasks.length > 0 && <h3 style={{ marginTop: '32px' }}>Concluídas</h3>}
                {completedTasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task}
                    />
                ))}
                
                {filteredTasks.length > 0 && !user.isPremium && <AdBanner />}

                {filteredTasks.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p>Nenhuma tarefa encontrada.<br />Que tal adicionar uma nova?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;

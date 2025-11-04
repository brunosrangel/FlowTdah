import React, { useState } from 'react';
import { Task } from '../types/types';
import { useAppContext } from '../context/AppContext';

const TaskItem = ({
    task,
    isNew
}: {
    task: Task;
    isNew?: boolean;
}) => {
    const { user, handleEditTask, handleStartPomodoro, taskActions } = useAppContext();
    const [isCompleting, setIsCompleting] = useState(false);
    const isGenerating = taskActions.generatingSubtasksFor === task.id;

    const handleToggle = () => {
        if (!task.completed) {
            setIsCompleting(true);
            setTimeout(() => {
                setIsCompleting(false);
            }, 1200); // Animation duration
        }
        taskActions.toggleTask(task.id);
    };

    const getRelativeDate = (timestamp: number) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return 'Criada hoje';
        if (diffInDays === 1) return 'Criada ontem';
        return `Criada há ${diffInDays} dias`;
    };

    const formatDueDate = (dueDate: string) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const taskDueDate = new Date(`${dueDate}T00:00:00`);

        if (taskDueDate.getTime() === today.getTime()) return 'Hoje';
        if (taskDueDate.getTime() === tomorrow.getTime()) return 'Amanhã';
        if (taskDueDate.getTime() === yesterday.getTime()) return 'Ontem';

        return taskDueDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    };

    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    return (
        <div className={`card task-item ${task.completed ? 'completed' : ''} ${isNew ? 'task-enter-animation' : ''}`} onClick={() => handleEditTask(task)}>
            {isGenerating && <div className="task-spinner"></div>}
            {!task.completed && (
                <button className="task-focus-btn" onClick={
                    (e) => {
                        e.stopPropagation();
                        handleStartPomodoro(task);
                    }} aria-label="Focar na tarefa">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <circle cx="12" cy="12" r="8"></circle>
                        <line x1="12" y1="2" x2="12" y2="4"></line>
                        <line x1="12" y1="20" x2="12" y2="22"></line>
                        <line x1="2" y1="12" x2="4" y2="12"></line>
                        <line x1="20" y1="12" x2="22" y2="12"></line>
                    </svg>
                </button>
            )}
            {isCompleting && (
                <div className="completion-overlay">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox"
                    checked={task.completed}
                    onChange={
                        (e) => {
                            e.stopPropagation();
                            handleToggle();
                        }
                    }
                    aria-label={`Marcar como ${task.completed ? 'não concluída' : 'concluída'}`}
                />
                <p style={{ margin: 0, flexGrow: 1, fontWeight: 500, paddingRight: '30px' }}>{task.title}</p>
            </div>
             {task.subtasks && task.subtasks.length > 0 && (
                <div className="subtasks-container">
                    {task.subtasks.map(subtask => (
                        <div key={subtask.id} className="subtask-item" onClick={e => e.stopPropagation()}>
                           <input 
                                type="checkbox" 
                                id={`subtask-${subtask.id}`} 
                                checked={subtask.completed}
                                onChange={() => taskActions.toggleSubtask(task.id, subtask.id)}
                            />
                            <label htmlFor={`subtask-${subtask.id}`}>{subtask.title}</label>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', paddingLeft: '36px', fontSize: '14px', color: 'var(--text-light-color)', flexWrap: 'wrap' }}>
                <span className={`priority-tag ${task.priority}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                    {task.priority}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    {task.category}
                </span>
                {task.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isOverdue ? 'var(--danger-color)' : 'inherit', fontWeight: isOverdue ? '600' : 'normal' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {formatDueDate(task.dueDate)}
                    </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {getRelativeDate(task.createdAt)}
                </span>
                {task.reminder && task.reminder.date && task.reminder.time && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        {new Date(task.reminder.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        {' às '}
                        {task.reminder.time}
                    </span>
                )}
            </div>
             {user.isPremium && !task.completed && !isGenerating && (
                <button 
                    className="btn-ai-subtasks" 
                    onClick={(e) => {
                        e.stopPropagation();
                        taskActions.generateSubtasks(task);
                    }}
                    aria-label="Gerar sub-tarefas com IA"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"></path></svg>
                </button>
            )}
        </div>
    );
};

export default TaskItem;

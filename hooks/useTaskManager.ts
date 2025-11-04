import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { Task, SubTask, User } from '../types/types';
import * as calendarService from '../services/googleCalendarService';
import * as geminiService from '../services/geminiService';

const tasksReducer = (state: Task[], action: { type: string, payload: any }): Task[] => {
    switch (action.type) {
        case 'ADD_TASK':
            return [action.payload, ...state];
        case 'UPDATE_TASK':
            return state.map(task =>
                task.id === action.payload.id ? { ...task, ...action.payload } : task
            );
        case 'DELETE_TASK':
            return state.filter(task => task.id !== action.payload.id);
        case 'TOGGLE_TASK':
            return state.map(task =>
                task.id === action.payload.id ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined } : task
            );
        case 'TOGGLE_SUBTASK':
             return state.map(task => {
                if (task.id === action.payload.taskId) {
                    const updatedSubtasks = task.subtasks?.map(subtask => 
                        subtask.id === action.payload.subtaskId 
                            ? { ...subtask, completed: !subtask.completed }
                            : subtask
                    );
                    return { ...task, subtasks: updatedSubtasks };
                }
                return task;
            });
        default:
            return state;
    }
};

const initialTasks: Task[] = [{
    id: '1',
    title: 'Finalizar o relatório de design',
    category: 'Trabalho',
    priority: 'alta',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    reminder: { date: new Date().toISOString().split('T')[0], time: '09:00' }
}, {
    id: '2',
    title: 'Comprar mantimentos',
    category: 'Pessoal',
    priority: 'média',
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
}, {
    id: '3',
    title: 'Agendar consulta no dentista',
    category: 'Saúde',
    priority: 'baixa',
    completed: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
}, ];


export const useTaskManager = (gapi: any, isSignedIn: boolean, user: User | null, showToast: (message: string, type: 'success' | 'error') => void) => {
    const [tasks, dispatch] = useLocalStorage<Task[]>('tasks', initialTasks, tasksReducer);
    const [newlyAddedTaskId, setNewlyAddedTaskId] = useState<string | null>(null);
    const [generatingSubtasksFor, setGeneratingSubtasksFor] = useState<string | null>(null);

    const syncTask = useCallback(async (task: Task) => {
        if (!user?.isPremium || !isSignedIn || !task.dueDate || !gapi) return;
        const eventId = await calendarService.syncTaskToCalendar(gapi, task);
        if (eventId && eventId !== task.googleCalendarEventId) {
             dispatch({ type: 'UPDATE_TASK', payload: { ...task, googleCalendarEventId: eventId } });
        }
        showToast('Tarefa sincronizada com Google Calendar!', 'success');
    }, [user, isSignedIn, gapi, dispatch, showToast]);

    const deleteTaskFromCal = useCallback(async (eventId: string) => {
        if (!user?.isPremium || !isSignedIn || !gapi) return;
        await calendarService.deleteTaskFromCalendar(gapi, eventId);
        showToast('Tarefa removida do Google Calendar.', 'success');
    }, [user, isSignedIn, gapi, showToast]);

    const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
        const newTaskId = Date.now().toString();
        const newTask: Task = {
            priority: 'média',
            ...taskData,
            id: newTaskId,
            completed: false,
            createdAt: Date.now(),
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
        syncTask(newTask);
        setNewlyAddedTaskId(newTaskId);
        setTimeout(() => setNewlyAddedTaskId(null), 600);
    };

    const updateTask = (updatedTask: Task) => {
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        syncTask(updatedTask);
    };

    const deleteTask = (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id);
        if (taskToDelete && taskToDelete.googleCalendarEventId) {
            deleteTaskFromCal(taskToDelete.googleCalendarEventId);
        }
        dispatch({ type: 'DELETE_TASK', payload: { id } });
    };
    
    const toggleTask = (id: string) => {
        dispatch({ type: 'TOGGLE_TASK', payload: { id } });
    };

    const toggleSubtask = (taskId: string, subtaskId: string) => {
        dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId, subtaskId } });
    };

    const generateSubtasks = async (task: Task) => {
        setGeneratingSubtasksFor(task.id);
        try {
            const subtaskTitles = await geminiService.generateSubtasksForTask(task);
            const newSubtasks: SubTask[] = subtaskTitles.map((title: string) => ({
                id: `sub-${Date.now()}-${Math.random()}`,
                title,
                completed: false
            }));
            dispatch({ type: 'UPDATE_TASK', payload: { ...task, subtasks: newSubtasks } });
        } catch (e) {
            console.error("Error generating subtasks:", e);
            showToast("Não foi possível gerar as sub-tarefas.", "error");
        } finally {
            setGeneratingSubtasksFor(null);
        }
    };

    return {
        tasks,
        newlyAddedTaskId,
        generatingSubtasksFor,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toggleSubtask,
        generateSubtasks,
    };
};

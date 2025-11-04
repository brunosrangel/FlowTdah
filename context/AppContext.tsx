import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User, PomodoroSettings } from '../types/types';
import { useTaskManager } from '../hooks/useTaskManager';
import useLocalStorage from '../hooks/useLocalStorage';
import { useGoogleApi } from './GoogleApiProvider';

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { gapi, isSignedIn } = useGoogleApi();

    const [currentScreen, setCurrentScreen] = useState('home');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [user, setUser] = useLocalStorage<User | null>('focusflow_user', null);
    const [pomodoroTask, setPomodoroTask] = useState<Task | null>(null);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { tasks, ...taskActions } = useTaskManager(gapi, isSignedIn, user, (message, type) => setToast({ message, type }));

    const [pomodoroSettings, setPomodoroSettings] = useLocalStorage<PomodoroSettings>('pomodoro_settings', {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        cycles: 4,
    });

    const [theme, setTheme] = useState(() => localStorage.getItem('focusflow_theme') || 'light');

    useEffect(() => {
        document.body.className = '';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        localStorage.setItem('focusflow_theme', theme);
    }, [theme]);

    const handleLogin = () => {
        const mockUser: User = { name: 'Usuário', isPremium: false };
        setUser(mockUser);
    };

    const handleNavigate = (screen: string) => {
        if (screen === 'add') {
            setEditingTask(null);
        }
        setCurrentScreen(screen);
    };
    
    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setCurrentScreen('add');
    };

    const handleStartPomodoro = (task: Task) => {
        setPomodoroTask(task);
    };

    const handleCompletePomodoroTask = () => {
        if (pomodoroTask) {
            taskActions.toggleTask(pomodoroTask.id);
        }
        setPomodoroTask(null);
    };
    
    const userActions = {
        logout: () => {
            setUser(null);
            localStorage.removeItem('focusflow_user');
            setCurrentScreen('home');
        },
        upgrade: () => {
            if (user) {
                setUser({ ...user, isPremium: true });
            }
        }
    };

    const value = {
        // State
        tasks,
        user,
        currentScreen,
        editingTask,
        pomodoroTask,
        pomodoroSettings,
        isAssistantOpen,
        toast,
        theme,
        newlyAddedTaskId: taskActions.newlyAddedTaskId,
        generatingSubtasksFor: taskActions.generatingSubtasksFor,

        // Setters
        setCurrentScreen,
        setEditingTask,
        setPomodoroTask,
        setPomodoroSettings,
        setIsAssistantOpen,
        setToast,
        setTheme,

        // Actions / Handlers
        handleLogin,
        handleNavigate,
        handleEditTask,
        handleStartPomodoro,
        handleCompletePomodoroTask,
        userActions,
        taskActions,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

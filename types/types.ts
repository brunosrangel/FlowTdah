export type SubTask = {
    id: string;
    title: string;
    completed: boolean;
};

export type Task = {
    id:string;
    title: string;
    category: string;
    priority: 'alta' | 'média' | 'baixa';
    completed: boolean;
    dueDate?: string;
    reminder?: {
        date: string;
        time: string;
    };
    notes?: string;
    createdAt: number;
    completedAt?: number;
    subtasks?: SubTask[];
    googleCalendarEventId?: string;
};

export type User = {
    name: string;
    isPremium: boolean;
};

export type PomodoroSettings = {
    focusDuration: number; // minutes
    shortBreakDuration: number; // minutes
    longBreakDuration: number; // minutes
    cycles: number; // number of focus sessions before a long break
};

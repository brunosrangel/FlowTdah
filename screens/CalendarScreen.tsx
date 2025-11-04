import React, { useState, useMemo } from 'react';
import { Task } from '../types/types';
import { useAppContext } from '../context/AppContext';

const CalendarScreen = ({
    tasks,
    onEdit
}: {
    tasks: Task[],
    onEdit: (task: Task) => void
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = new Date(`${task.dueDate}T00:00:00`).toDateString();
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey)?.push(task);
            }
        });
        return map;
    }, [tasks]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="screen">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-days-header">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div className="calendar-grid">
                {days.map((date, index) => {
                    const isToday = isSameDay(date, new Date());
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const tasksForDay = tasksByDate.get(date.toDateString()) || [];

                    return (
                        <div key={index} className={`calendar-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'empty' : ''}`}>
                            {isCurrentMonth && (
                                <>
                                    <span className="day-number">{date.getDate()}</span>
                                    <div className="calendar-tasks">
                                        {tasksForDay.slice(0, 3).map(task => (
                                            <div key={task.id} className={`calendar-task ${task.completed ? 'completed' : ''}`} onClick={() => onEdit(task)}>
                                                {task.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarScreen;

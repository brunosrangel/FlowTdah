import React, { useState, useEffect, useRef } from 'react';
import { Task, PomodoroSettings } from '../types/types';

const PomodoroScreen = ({
    task,
    settings,
    onComplete,
    onExit
}: {
    task: Task;
    settings: PomodoroSettings;
    onComplete: () => void;
    onExit: () => void;
}) => {
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
    const [pomodorosInCycle, setPomodorosInCycle] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(settings.focusDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const modeLabels = {
        focus: 'Foco',
        shortBreak: 'Pausa Curta',
        longBreak: 'Pausa Longa'
    };

    const nextMode = () => {
        setIsActive(false);
        if (mode === 'focus') {
            const completedPomodoros = pomodorosInCycle + 1;
            setPomodorosInCycle(completedPomodoros);
            if (completedPomodoros % settings.cycles === 0) {
                setMode('longBreak');
                setSecondsLeft(settings.longBreakDuration * 60);
            } else {
                setMode('shortBreak');
                setSecondsLeft(settings.shortBreakDuration * 60);
            }
        } else {
            setMode('focus');
            setSecondsLeft(settings.focusDuration * 60);
        }
    };

    useEffect(() => {
        if (isActive && secondsLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
             if (intervalRef.current) clearInterval(intervalRef.current);
             nextMode();
        }
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, secondsLeft]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    const startPauseLabel = isActive ? 'Pausar' : (mode === 'focus' ? 'Iniciar Foco' : 'Iniciar Pausa');

    return (
        <div className={`pomodoro-screen mode-${mode}`}>
            <p className="pomodoro-mode-label">{modeLabels[mode]}</p>
            <h1 className="pomodoro-task-title">{task.title}</h1>
            <div className="pomodoro-timer-display">{formatTime(secondsLeft)}</div>
            <div className="pomodoro-cycles">
                {Array.from({ length: settings.cycles }).map((_, index) => (
                    <div 
                        key={index} 
                        className={`cycle-indicator ${index < pomodorosInCycle ? 'completed' : ''}`} 
                    />
                ))}
            </div>
            <div className="pomodoro-controls">
                <button className="btn-secondary" onClick={() => setIsActive(!isActive)} style={{minWidth: '140px'}}>{startPauseLabel}</button>
                <button className="btn-secondary" onClick={nextMode}>Pular</button>
            </div>
            <button className="btn-primary" onClick={onComplete} style={{ marginBottom: '12px' }}>Concluir Tarefa e Sair</button>
            <button className="btn-secondary" onClick={onExit}>Sair do Modo Foco</button>
        </div>
    );
};

export default PomodoroScreen;

import React, { useState } from 'react';
import { Task } from '../types/types';
import * as geminiService from '../services/geminiService';

const VirtualAssistant = ({
    onAddTask,
    onClose
}: {
    onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
    onClose: () => void;
}) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [parsedTask, setParsedTask] = useState<Omit<Task, 'id' | 'completed' | 'createdAt'> | null>(null);
    const [error, setError] = useState('');

    const handleSendPrompt = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setParsedTask(null);

        try {
            const parsed = await geminiService.parseTaskFromPrompt(prompt);
            setParsedTask(parsed);
        } catch (e) {
            console.error("Error calling Gemini API:", e);
            setError("Não consegui entender o pedido. Tente ser mais específico.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmTask = () => {
        if (parsedTask) {
            onAddTask(parsedTask);
            onClose();
        }
    };

    const renderContent = () => {
        if (isLoading) return <p>Analisando...</p>;
        if (error) return <p style={{ color: 'var(--danger-color)' }}>{error}</p>;
        if (parsedTask) {
            return (
                <div className="confirmation-view">
                    <h3>Confirmar Tarefa?</h3>
                    <p>
                        <strong>Título:</strong> {parsedTask.title}<br />
                        {parsedTask.priority && <><strong>Prioridade:</strong> {parsedTask.priority}<br /></>}
                        {parsedTask.dueDate && <><strong>Data:</strong> {new Date(`${parsedTask.dueDate}T00:00:00`).toLocaleDateString('pt-BR')}<br /></>}
                        {parsedTask.reminder?.time && <><strong>Lembrete:</strong> {parsedTask.reminder.time}</>}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button className="btn-secondary" onClick={() => setParsedTask(null)}>Cancelar</button>
                        <button className="btn-primary" onClick={handleConfirmTask}>Salvar</button>
                    </div>
                </div>
            )
        }

        return (
            <div className="assistant-input-form">
                <textarea value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Me lembrar de comprar pão amanhã às 9h"
                    rows={3}
                />
                <button className="btn-primary" onClick={handleSendPrompt}>Criar Tarefa</button>
            </div>
        )
    }

    return (
        <div className="assistant-overlay" onClick={onClose}>
            <div className="assistant-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Assistente Virtual✨</h3>
                {renderContent()}
            </div>
        </div>
    );
};

export default VirtualAssistant;

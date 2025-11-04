import React, { useState } from 'react';
import { Task } from '../types/types';
import { useAppContext } from '../context/AppContext';

const AddTaskScreen = ({
    onBack,
    editingTask
}: {
    onBack: () => void;
    editingTask: Task | null;
}) => {
    const { taskActions } = useAppContext();
    const [title, setTitle] = useState(editingTask?.title || '');
    const [category, setCategory] = useState(editingTask?.category || 'Pessoal');
    const [priority, setPriority] = useState<Task['priority']>(editingTask?.priority || 'média');
    const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
    const [notes, setNotes] = useState(editingTask?.notes || '');
    const [showReminder, setShowReminder] = useState(!!editingTask?.reminder);
    const [reminderDate, setReminderDate] = useState(editingTask?.reminder?.date || '');
    const [reminderTime, setReminderTime] = useState(editingTask?.reminder?.time || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const taskData = {
            title,
            category,
            priority,
            dueDate,
            notes,
        };

        if (editingTask) {
            const updatedTask: Task = { ...editingTask,
                ...taskData
            };
            if (showReminder && reminderDate && reminderTime) {
                updatedTask.reminder = {
                    date: reminderDate,
                    time: reminderTime
                };
            } else {
                delete updatedTask.reminder;
            }
            taskActions.updateTask(updatedTask);
        } else {
            const newTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'> = {
                ...taskData,
            };
            if (showReminder && reminderDate && reminderTime) {
                newTaskData.reminder = {
                    date: reminderDate,
                    time: reminderTime
                };
            }
            taskActions.addTask(newTaskData);
        }
        onBack();
    };

    return (
        <div className="screen" style={{ animation: 'slideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}>
            <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="title">Título da Tarefa</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Comprar leite" required/>
                </div>

                <div className="input-group">
                    <label htmlFor="category">Categoria</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Pessoal">Pessoal</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Estudo">Estudo</option>
                        <option value="Saúde">Saúde</option>
                    </select>
                </div>
                
                <div className="input-group">
                    <label>Prioridade</label>
                    <div className="priority-selector">
                        {(['baixa', 'média', 'alta'] as const).map(p => (
                            <button
                                key={p}
                                type="button"
                                className={`${p} ${priority === p ? 'active' : ''}`}
                                onClick={() => setPriority(p)}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="input-group">
                    <label htmlFor="dueDate">Data de Vencimento</label>
                    <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="input-group">
                    <div className="checkbox-group">
                        <input type="checkbox" id="addReminder" checked={showReminder} onChange={(e) => setShowReminder(e.target.checked)} />
                        <label htmlFor="addReminder">Adicionar Lembrete</label>
                    </div>
                </div>

                {showReminder && (
                    <div className="input-group" style={{ animation: 'fadeIn 0.3s' }}>
                        <div className="reminder-input-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            <input id="reminderDate" type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} aria-label="Data do lembrete" />
                            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} aria-label="Hora do lembrete" />
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <label htmlFor="notes">Anotações</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Algum detalhe extra sobre a tarefa..."></textarea>
                </div>


                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                    <button type="button" className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                        {editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}
                    </button>
                </div>

                {editingTask && (
                    <button type="button" className="btn btn-danger" style={{ width: '100%', marginTop: '12px' }}
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                                taskActions.deleteTask(editingTask.id);
                                onBack();
                            }
                        }}>
                        Excluir Tarefa
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddTaskScreen;

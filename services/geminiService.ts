import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types/types';

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateSubtasksForTask = async (task: Task): Promise<string[]> => {
    const ai = getAiClient();
    const prompt = `Dada a tarefa principal "${task.title}"${task.notes ? ` com as seguintes anotações: "${task.notes}"` : ''}, divida-a em sub-tarefas pequenas e acionáveis. Retorne no máximo 5 sub-tarefas.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction: "Você é um assistente de produtividade. Sua função é dividir tarefas complexas em uma lista de sub-tarefas simples. Retorne a resposta como um array JSON de strings.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subtasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            },
        },
    });
    
    const result = JSON.parse(response.text);
    return result.subtasks || [];
};

export const parseTaskFromPrompt = async (prompt: string): Promise<Omit<Task, 'id' | 'completed' | 'createdAt'>> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction: "Você é um assistente virtual para um aplicativo de lista de tarefas chamado FocusFlow. Sua função é extrair detalhes de uma solicitação em linguagem natural e convertê-los em uma tarefa estruturada no formato JSON. As categorias válidas são 'Pessoal', 'Trabalho', 'Estudo', 'Saúde'. Se a categoria não for mencionada, use 'Pessoal'. A prioridade pode ser 'alta', 'média', ou 'baixa'. Se a urgência for mencionada (ex: 'urgente', 'para hoje'), defina a prioridade como 'alta'. Se não for mencionada, use 'média'. A data deve estar no formato AAAA-MM-DD e a hora no formato HH:MM de 24 horas. Se um lembrete for mencionado, a data do lembrete ('reminder.date') deve ser a mesma que a data de vencimento ('dueDate').",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "O título da tarefa." },
                    category: { type: Type.STRING, description: "Uma das categorias: Pessoal, Trabalho, Estudo, Saúde." },
                    priority: { type: Type.STRING, description: "A prioridade: alta, média, ou baixa." },
                    dueDate: { type: Type.STRING, description: "A data de vencimento no formato AAAA-MM-DD." },
                    reminder: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING, description: "A data do lembrete no formato AAAA-MM-DD." },
                            time: { type: Type.STRING, description: "A hora do lembrete no formato HH:MM." }
                        }
                    },
                    notes: { type: Type.STRING, description: "Qualquer anotação adicional." }
                },
                required: ["title", "category", "priority"]
            },
        },
    });

    return JSON.parse(response.text);
};

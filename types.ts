
export interface Task {
  id: number;
  title: string;
  category: 'Pessoal' | 'Trabalho' | 'Estudo';
  status: 'pending' | 'completed';
  duration?: number;
}

export type Screen = 'home' | 'add_task' | 'focus_mode' | 'stats' | 'premium';

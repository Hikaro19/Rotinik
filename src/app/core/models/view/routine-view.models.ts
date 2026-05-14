import { Rotina } from '@core/models/domain';

export interface TaskViewModel {
  id: string;
  routineId: string;
  title: string;
  description?: string;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  dueDate?: Date;
  completedDate?: Date;
  order: number;
}

export interface RoutineViewModel {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  tasks: TaskViewModel[];
  totalXP: number;
  totalCoins: number;
  createdDate: Date;
  completionStreak: number;
  lastCompletedDate?: Date;
  isCompleted: boolean;
  domainModel?: Rotina;
}

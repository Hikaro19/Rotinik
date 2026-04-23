export interface RoutineUserDto {
  id: string;
  name: string;
  email: string;
  level: number;
  currentXp: number;
  totalXp: number;
  coins: number;
  levelProgress: number;
  nextLevelXp: number;
  lastActivityAt?: string;
}

export interface RoutineTaskDto {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  xpReward: number;
  coinReward: number;
  order: number;
  completedAt?: string;
}

export interface RoutineDto {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  tasks: RoutineTaskDto[];
  totalXp: number;
  totalCoins: number;
  createdAt: string;
  completionStreak: number;
  lastCompletedAt?: string;
  isCompleted: boolean;
}

export interface RoutinesSnapshotDto {
  user: RoutineUserDto;
  routines: RoutineDto[];
}

export interface CreateRoutineRequestDto {
  title: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface UpdateRoutineRequestDto {
  title?: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface CreateTaskRequestDto {
  title: string;
  description?: string;
  xpReward: number;
  coinReward: number;
}

export interface CompleteTaskResponseDto {
  routine: RoutineDto;
  user: RoutineUserDto;
  reward: {
    xp: number;
    coins: number;
  };
}

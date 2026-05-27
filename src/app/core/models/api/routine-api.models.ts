export type TaskImportance = 'baixa' | 'media' | 'alta' | 'critica';

export interface RoutineUserDto {
  id: string;
  name: string;
  userName: string;
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
  routineId?: string | number;
  taskId?: string | number;
  title: string;
  description?: string;
  isCompleted: boolean;
  importance?: TaskImportance;
  estimatedMinutes?: number;
  xpReward?: number;
  coinReward?: number;
  order: number;
  completedAt?: string;
}

export interface RoutineSummaryResponse {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  category?: string;
  isTemplate: boolean;
  taskCount: number;
  createdAt: string;
}

export interface RoutineDto {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  category?: string;
  frequency?: string;
  isDefault?: boolean;
  createdAt: string;
  tasks: RoutineTaskDto[];
}

export interface RoutinesSnapshotDto {
  user: RoutineUserDto;
  routines: RoutineDto[];
}

export interface CreateRoutineRequestDto {
  title: string;
  description?: string;
  category?: string;
  frequency?: string;
}

export interface UpdateRoutineRequestDto {
  title?: string;
  description?: string;
  category?: string;
  frequency?: string;
}

export interface CreateTaskRequestDto {
  title: string;
  description?: string;
  estimatedMinutes: number;
  importance: TaskImportance;
}

export interface UpdateTaskRequestDto {
  title: string;
  description?: string;
  estimatedMinutes: number;
  importance: TaskImportance;
}

export interface CompleteTaskResponseDto {
  routine: RoutineDto;
  user: RoutineUserDto;
  reward: {
    xp: number;
    coins: number;
  };
}

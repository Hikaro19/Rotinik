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
  routineId?: string | number;
  taskId?: string | number;
  taskTitle: string;
  taskDescription?: string;
  isCompleted: boolean;
  xpReward: number; // Placeholder: backend currently doesn't return this
  coinReward: number; // Placeholder
  order: number;
  completedAt?: string;
}

export interface RoutineSummaryResponse {
  id: string;
  userId?: number;
  name: string;
  description?: string;
  theme?: string;
  isTemplate: boolean;
  taskCount: number;
  createdAt: string;
}

export interface RoutineDto {
  id: string;
  userId?: number;
  name: string;
  description?: string;
  theme?: string;
  isTemplate: boolean;
  createdAt: string;
  tasks: RoutineTaskDto[];
}

export interface RoutinesSnapshotDto {
  user: RoutineUserDto;
  routines: RoutineDto[];
}

export interface CreateRoutineRequestDto {
  name: string;
  description?: string;
  theme?: string;
}

export interface UpdateRoutineRequestDto {
  name?: string;
  description?: string;
  theme?: string;
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

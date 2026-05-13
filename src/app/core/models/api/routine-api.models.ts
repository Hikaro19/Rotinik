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
  title?: string;
  description?: string;
  taskTitle?: string;
  taskDescription?: string;
  isCompleted: boolean;
  estimatedMinutes?: number;
  elapsedMinutes?: number;
  startedAt?: string;
  canComplete?: boolean;
  xpReward: number;
  coinReward: number;
  order: number;
  completedAt?: string;
}

export interface RoutineResponse {
  id: string;
  userId?: string | number | null;
  name: string;
  description?: string;
  theme?: string;
  isTemplate: boolean;
  taskCount: number;
  createdAt: string;
}

export type RoutineSummaryResponse = RoutineResponse;

export interface TaskResponse extends RoutineTaskDto {}

export interface RoutineDto extends RoutineResponse {
  id: string;
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
  estimatedMinutes?: number;
  xpReward: number;
  coinReward: number;
}

export interface StartTaskExecutionResponseDto {
  routine?: RoutineDto;
  task?: RoutineTaskDto;
  taskId?: string | number;
  startedAt?: string;
  estimatedMinutes?: number;
  elapsedMinutes?: number;
  canComplete?: boolean;
}

export interface CompleteTaskResponseDto {
  routine: RoutineDto;
  user: RoutineUserDto;
  reward: {
    xp: number;
    coins: number;
  };
}

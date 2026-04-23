export interface AchievementDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface ActivityDayDto {
  date: string;
  completed: boolean;
}

export interface ProfileHistoryItemDto {
  id: string;
  type: 'purchase' | 'achievement' | 'level-up';
  title: string;
  description: string;
  icon: string;
  date: string;
  details?: string;
}

export interface ProfileStatsDto {
  totalXpEarned: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  routinesCreated: number;
  routinesCompleted: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceStart: number;
}

export interface ProfileSnapshotDto {
  memberSince: string;
  achievements: AchievementDto[];
  activityHistory: ActivityDayDto[];
  historyItems: ProfileHistoryItemDto[];
  stats: ProfileStatsDto;
}

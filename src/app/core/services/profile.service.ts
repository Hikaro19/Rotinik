import { Injectable, inject, computed, signal } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ProfileSnapshotDto } from '@core/models/api';
import {
  createMockAchievements,
  createMockHistoryItems,
  createMockMemberSinceDate,
  createMockProfileStats,
  generateMockActivityHistory,
} from '@core/mocks/profile.mock';
import { ProfileApiService } from './profile-api.service';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate?: Date;
  progress?: number;
  target?: number;
}

export interface ProfileStats {
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

export interface ActivityDay {
  date: Date;
  completed: boolean;
}

export interface ProfileHistoryItem {
  id: string;
  type: 'purchase' | 'achievement' | 'level-up';
  title: string;
  description: string;
  icon: string;
  date: Date;
  details?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly profileApi = inject(ProfileApiService);

  readonly achievementsSignal = signal<Achievement[]>(createMockAchievements() as Achievement[]);
  readonly activityHistorySignal = signal<ActivityDay[]>(generateMockActivityHistory());
  readonly memberSinceSignal = signal<Date>(createMockMemberSinceDate());
  readonly historyItemsSignal = signal<ProfileHistoryItem[]>(createMockHistoryItems() as ProfileHistoryItem[]);
  readonly profileStatsSignal = signal<ProfileStats>(createMockProfileStats());
  readonly isInitializedSignal = signal(false);
  readonly isLoadingSignal = signal(false);

  readonly unlockedAchievements = computed(() => this.achievementsSignal().filter((achievement) => achievement.unlockedDate).length);
  readonly totalAchievements = computed(() => this.achievementsSignal().length);
  readonly activeDays = computed(() => this.activityHistorySignal().filter((day) => day.completed).length);
  readonly activityPercentage = computed(() => {
    const total = this.activityHistorySignal().length;
    const active = this.activeDays();
    return total > 0 ? Math.round((active / total) * 100) : 0;
  });
  readonly daysSinceStart = computed(() => {
    const diff = Date.now() - this.memberSinceSignal().getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });
  readonly last7DaysActivity = computed(() => this.activityHistorySignal().slice(-7));
  readonly currentMonthActivity = computed(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return this.activityHistorySignal().filter((day) => {
      return day.date.getMonth() === currentMonth && day.date.getFullYear() === currentYear;
    });
  });

  initialize(): void {
    if (this.isInitializedSignal()) {
      return;
    }

    this.isInitializedSignal.set(true);

    if (environment.enableMockData) {
      return;
    }

    this.loadSnapshotFromApi();
  }

  hydrateFromApi(snapshot: ProfileSnapshotDto): void {
    this.memberSinceSignal.set(new Date(snapshot.memberSince));
    this.achievementsSignal.set(
      snapshot.achievements.map((achievement) => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        unlockedDate: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
        progress: achievement.progress,
        target: achievement.target,
      })),
    );
    this.activityHistorySignal.set(
      snapshot.activityHistory.map((day) => ({
        date: new Date(day.date),
        completed: day.completed,
      })),
    );
    this.historyItemsSignal.set(
      snapshot.historyItems.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        icon: item.icon,
        date: new Date(item.date),
        details: item.details,
      })),
    );
    this.profileStatsSignal.set({
      totalXpEarned: snapshot.stats.totalXpEarned,
      totalCoinsEarned: snapshot.stats.totalCoinsEarned,
      totalCoinsSpent: snapshot.stats.totalCoinsSpent,
      routinesCreated: snapshot.stats.routinesCreated,
      routinesCompleted: snapshot.stats.routinesCompleted,
      tasksCompleted: snapshot.stats.tasksCompleted,
      currentStreak: snapshot.stats.currentStreak,
      longestStreak: snapshot.stats.longestStreak,
      daysSinceStart: snapshot.stats.daysSinceStart,
    });
  }

  getAchievements(): Achievement[] {
    return this.achievementsSignal();
  }

  getUnlockedAchievements(): Achievement[] {
    return this.achievementsSignal().filter((achievement) => achievement.unlockedDate);
  }

  getInProgressAchievements(): Achievement[] {
    return this.achievementsSignal().filter((achievement) => !achievement.unlockedDate && achievement.progress);
  }

  unlockAchievement(achievementId: string): void {
    this.achievementsSignal.update((achievements) =>
      achievements.map((achievement) =>
        achievement.id === achievementId && !achievement.unlockedDate
          ? { ...achievement, unlockedDate: new Date() }
          : achievement,
      ),
    );
  }

  updateAchievementProgress(achievementId: string, progress: number): void {
    this.achievementsSignal.update((achievements) =>
      achievements.map((achievement) => {
        if (achievement.id !== achievementId) {
          return achievement;
        }

        const updatedAchievement: Achievement = { ...achievement, progress };
        if (achievement.target && progress >= achievement.target && !achievement.unlockedDate) {
          updatedAchievement.unlockedDate = new Date();
        }

        return updatedAchievement;
      }),
    );
  }

  getActivityHistory(): ActivityDay[] {
    return this.activityHistorySignal();
  }

  completeDay(date: Date): void {
    this.activityHistorySignal.update((history) =>
      history.map((day) => (day.date.toDateString() === date.toDateString() ? { ...day, completed: true } : day)),
    );
  }

  resetProfile(): void {
    this.achievementsSignal.set([]);
    this.activityHistorySignal.set([]);
    this.historyItemsSignal.set([]);
    this.profileStatsSignal.set(createMockProfileStats());
    this.isInitializedSignal.set(false);
  }

  private loadSnapshotFromApi(): void {
    this.isLoadingSignal.set(true);
    this.profileApi
      .getSnapshot()
      .pipe(take(1))
      .subscribe({
        next: (snapshot) => {
          this.hydrateFromApi(snapshot);
          this.isLoadingSignal.set(false);
        },
        error: () => {
          this.isLoadingSignal.set(false);
        },
      });
  }
}

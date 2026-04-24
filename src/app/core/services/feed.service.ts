import { Injectable, signal, computed } from '@angular/core';
import { createMockFeedRoutines } from '@core/mocks/feed.mock';

export interface SharedRoutine {
  id: string;
  routineId: string;
  routineName: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'fitness' | 'learning' | 'other';
  sharedBy: {
    id: string;
    username: string;
    avatar: string;
    level: number;
  };
  description: string;
  completionStats: {
    streakDays: number;
    totalCompleted: number;
    successRate: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  estimatedTime: number;
  shares: number;
  likes: number;
  isLiked: boolean;
  sharedAt: Date;
  tasks?: string[];
}

export interface FeedPage {
  routines: SharedRoutine[];
  hasMore: boolean;
  pageIndex: number;
}

@Injectable({ providedIn: 'root' })
export class FeedService {
  private mockRoutines: SharedRoutine[] = createMockFeedRoutines();

  feedRoutinesSignal = signal<SharedRoutine[]>([]);
  currentPageSignal = signal(0);
  isLoadingMoreSignal = signal(false);
  hasMoreRoutinesSignal = signal(true);

  totalRoutinesLoaded = computed(() => this.feedRoutinesSignal().length);

  constructor() {
    this.loadInitialFeed();
  }

  private loadInitialFeed(): void {
    this.feedRoutinesSignal.set(this.mockRoutines.slice(0, 3));
    this.currentPageSignal.set(1);
  }

  loadMoreRoutines(): Promise<void> {
    return new Promise((resolve) => {
      this.isLoadingMoreSignal.set(true);

      setTimeout(() => {
        const currentPage = this.currentPageSignal();
        const startIndex = currentPage * 3;
        const endIndex = startIndex + 3;

        if (startIndex < this.mockRoutines.length) {
          const newRoutines = [...this.feedRoutinesSignal(), ...this.mockRoutines.slice(startIndex, endIndex)];
          this.feedRoutinesSignal.set(newRoutines);
          this.currentPageSignal.set(currentPage + 1);

          if (endIndex >= this.mockRoutines.length) {
            this.hasMoreRoutinesSignal.set(false);
          }
        } else {
          this.hasMoreRoutinesSignal.set(false);
        }

        this.isLoadingMoreSignal.set(false);
        resolve();
      }, 600);
    });
  }

  toggleLike(routineId: string): void {
    this.feedRoutinesSignal.update((routines) =>
      routines.map((routine) =>
        routine.id === routineId
          ? { ...routine, isLiked: !routine.isLiked, likes: routine.isLiked ? routine.likes - 1 : routine.likes + 1 }
          : routine,
      ),
    );
  }

  copyRoutine(routineId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const routine = this.mockRoutines.find((item) => item.id === routineId);
        if (routine) {
          console.log(`Rotina "${routine.routineName}" copiada com sucesso`);
        }
        resolve();
      }, 500);
    });
  }

  getAllRoutines(): SharedRoutine[] {
    return [...this.mockRoutines];
  }

  getRoutineById(id: string): SharedRoutine | undefined {
    return this.mockRoutines.find((routine) => routine.id === id);
  }

  searchRoutines(query: string): SharedRoutine[] {
    const lowercaseQuery = query.toLowerCase();
    return this.mockRoutines.filter(
      (routine) =>
        routine.routineName.toLowerCase().includes(lowercaseQuery) ||
        routine.description.toLowerCase().includes(lowercaseQuery) ||
        routine.sharedBy.username.toLowerCase().includes(lowercaseQuery),
    );
  }

  getRoutinesByCategory(category: string): SharedRoutine[] {
    return this.mockRoutines.filter((routine) => routine.category === category);
  }
}

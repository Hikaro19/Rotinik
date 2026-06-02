import { Injectable, inject } from '@angular/core';
import { FeedService, SharedRoutine } from './feed.service';

@Injectable({ providedIn: 'root' })
export class FeedFacadeService {
  private readonly feedService = inject(FeedService);

  readonly routines = this.feedService.feedRoutinesSignal;
  readonly isLoadingMore = this.feedService.isLoadingMoreSignal;
  readonly hasMoreRoutines = this.feedService.hasMoreRoutinesSignal;

  filteredRoutines(query: string, category: string | null): SharedRoutine[] {
    const normalizedQuery = query.trim().toLowerCase();

    return this.routines().filter((routine) => {
      if (category && routine.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        routine.routineName.toLowerCase().includes(normalizedQuery) ||
        routine.description.toLowerCase().includes(normalizedQuery) ||
        routine.sharedBy.username.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  loadMoreRoutines(): Promise<void> {
    return this.feedService.loadMoreRoutines();
  }

  toggleLike(routineId: string): void {
    this.feedService.toggleLike(routineId);
  }

  copyRoutine(routineId: string): Promise<void> {
    return this.feedService.copyRoutine(routineId);
  }
}

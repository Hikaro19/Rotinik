import { computed, Injectable, inject } from '@angular/core';
import { LeaderboardEntry, UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardFacadeService {
  private readonly userService = inject(UserService);

  readonly currentUser = this.userService.currentUserSignal;
  readonly userRank = this.userService.userRank;
  readonly sortType = this.userService.sortTypeSignal;
  readonly leaderboard = this.userService.leaderboard;
  readonly topThree = computed(() => this.leaderboard().slice(0, 3));

  setSortType(type: 'xp' | 'level' | 'achievements'): void {
    this.userService.setSortType(type);
  }

  toggleFollow(userId: string): void {
    this.userService.toggleFollow(userId);
  }

  filteredLeaderboard(query: string): LeaderboardEntry[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.leaderboard();
    }

    return this.leaderboard().filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.bio?.toLowerCase().includes(normalizedQuery),
    );
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUser().id === userId;
  }
}

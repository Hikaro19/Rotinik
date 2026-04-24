import { Injectable, signal, computed } from '@angular/core';
import { createMockCurrentUser, createMockUsers } from '@core/mocks/user.mock';

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalXP: number;
  coins: number;
  achievements: number;
  lastActivityDate: Date;
  joinDate: Date;
  bio?: string;
  isFollowed?: boolean;
}

export interface LeaderboardEntry extends User {
  rank: number;
  medal?: 'gold' | 'silver' | 'bronze';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSignal = signal<User[]>(createMockUsers());
  currentUserSignal = signal<User>(createMockCurrentUser());
  sortTypeSignal = signal<'xp' | 'level' | 'achievements'>('xp');

  leaderboard = computed(() => {
    const users = this.usersSignal();
    const sortType = this.sortTypeSignal();

    const sorted = [...users].sort((a, b) => {
      switch (sortType) {
        case 'level':
          return b.level - a.level;
        case 'achievements':
          return b.achievements - a.achievements;
        case 'xp':
        default:
          return b.totalXP - a.totalXP;
      }
    });

    return sorted.map((user, index): LeaderboardEntry => ({
      ...user,
      rank: index + 1,
      medal: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined,
    }));
  });

  userRank = computed(() => {
    const currentUser = this.currentUserSignal();
    const entry = this.leaderboard().find((user) => user.id === currentUser.id);
    return entry?.rank || 0;
  });

  top3 = computed(() => this.leaderboard().slice(0, 3));

  getAllUsers(): User[] {
    return this.usersSignal();
  }

  getUserById(id: string): User | undefined {
    return this.usersSignal().find((user) => user.id === id);
  }

  toggleFollow(userId: string): void {
    this.usersSignal.update((users) =>
      users.map((user) => (user.id === userId ? { ...user, isFollowed: !user.isFollowed } : user)),
    );
  }

  setSortType(type: 'xp' | 'level' | 'achievements'): void {
    this.sortTypeSignal.set(type);
  }

  searchUsers(query: string): User[] {
    if (!query) return this.usersSignal();

    const lowerQuery = query.toLowerCase();
    return this.usersSignal().filter(
      (user) => user.name.toLowerCase().includes(lowerQuery) || user.bio?.toLowerCase().includes(lowerQuery),
    );
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';
import { UserApiDto } from '../models/user-api.models';
import { RoutineService } from '@core/services/routine.service';

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
  private readonly http = inject(HttpClient);
  private readonly routineService = inject(RoutineService);
  private readonly baseUrl = `${environment.apiUrl}`;
  private usersSignal = signal<User[]>([]);
  sortTypeSignal = signal<'xp' | 'level' | 'achievements'>('xp');

  readonly currentUserSignal = computed<User>(() => {
    const routineUser = this.routineService.currentUserSignal();
    if (!routineUser) return this.createEmptyUser();

    const foundUserInList = this.usersSignal().find((u) => u.id === routineUser.id);
    const achievementsCount = foundUserInList ? foundUserInList.achievements : 0;

    return {
      id: routineUser.id,
      name: routineUser.name,
      avatar: this.buildInitialsAvatar(routineUser.name || routineUser.email),
      level: routineUser.level,
      totalXP: routineUser.currentXp,
      coins: routineUser.coins,
      achievements: achievementsCount,
      lastActivityDate: new Date(),
      joinDate: new Date(),
      bio: routineUser.userName ? `@${routineUser.userName}` : routineUser.email,
      isFollowed: false,
    };
  });

  constructor() {
    this.fetchUsers().subscribe({
      error: () => this.usersSignal.set([]),
    });
  }

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

  fetchUsers(): Observable<User[]> {
    return this.http.get<UserApiDto[]>(`${this.baseUrl}/usuarios`).pipe(
      map((users) => users.map((user) => this.mapApiUser(user))),
      tap((users) => this.usersSignal.set(users)),
    );
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

  private mapApiUser(user: UserApiDto): User {
    const id = String(user.id ?? '');
    const name = user.name ?? '';
    const email = user.email ?? '';

    return {
      id,
      name,
      avatar: this.buildInitialsAvatar(name || email),
      level: user.level ?? 1,
      totalXP: user.points ?? 0,
      coins: user.coins ?? 0,
      achievements: user.achievements ?? 0,
      lastActivityDate: user.lastActivityDate ? new Date(user.lastActivityDate) : new Date(),
      joinDate: user.joinDate ? new Date(user.joinDate) : new Date(),
      bio: user.userName ? `@${user.userName}` : email,
      isFollowed: user.isFollowed ?? false,
    };
  }

  private createEmptyUser(): User {
    return {
      id: '',
      name: '',
      avatar: '',
      level: 0,
      totalXP: 0,
      coins: 0,
      achievements: 0,
      lastActivityDate: new Date(),
      joinDate: new Date(),
      bio: '',
      isFollowed: false,
    };
  }

  private buildInitialsAvatar(value: string): string {
    const initials = value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return initials || 'U';
  }
}

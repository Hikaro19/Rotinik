import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';
import { UserApiDto } from '../models/api/user-api.models';

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
  private readonly baseUrl = `${environment.apiUrl}`;
  private usersSignal = signal<User[]>([]);
  currentUserSignal = signal<User>(this.createEmptyUser());
  sortTypeSignal = signal<'xp' | 'level' | 'achievements'>('xp');

  constructor(private readonly http: HttpClient) {
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
    const id = String(user.Id ?? user.id ?? user.UserId ?? user.userId ?? '');
    const name = user.Nome ?? user.nome ?? '';
    const email = user.Email ?? user.email ?? '';

    return {
      id,
      name,
      avatar: this.buildInitialsAvatar(name || email),
      level: 0,
      totalXP: 0,
      coins: 0,
      achievements: 0,
      lastActivityDate: new Date(),
      joinDate: new Date(),
      bio: email,
      isFollowed: false,
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

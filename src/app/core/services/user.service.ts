import { Injectable, signal, computed } from '@angular/core';

/**
 * User interface - Dados públicos do usuário para ranking
 */
export interface User {
  id: string;
  name: string;
  avatar: string; // emoji
  level: number;
  totalXP: number;
  coins: number;
  achievements: number;
  lastActivityDate: Date;
  joinDate: Date;
  bio?: string;
  isFollowed?: boolean;
}

/**
 * LeaderboardEntry - Entrada no ranking com posição
 */
export interface LeaderboardEntry extends User {
  rank: number;
  medal?: 'gold' | 'silver' | 'bronze';
}

/**
 * UserService: Gerencia dados de usuários e ranking
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Lista de todos os usuários (mock data)
   */
  private usersSignal = signal<User[]>([
    {
      id: 'user-001',
      name: 'Jogador Lendário',
      avatar: '👑',
      level: 50,
      totalXP: 125000,
      coins: 5000,
      achievements: 25,
      lastActivityDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      bio: 'Master da gamificação',
    },
    {
      id: 'user-002',
      name: 'Streaker Infinito',
      avatar: '⭐',
      level: 48,
      totalXP: 118000,
      coins: 4500,
      achievements: 23,
      lastActivityDate: new Date(Date.now() - 30 * 60 * 1000),
      joinDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
      bio: 'Nunca perde um dia',
    },
    {
      id: 'user-003',
      name: 'Colecionador Elite',
      avatar: '🏆',
      level: 45,
      totalXP: 110000,
      coins: 4000,
      achievements: 24,
      lastActivityDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
      bio: 'Todos os achievements = flex',
    },
    {
      id: 'user-004',
      name: 'Speed Runner',
      avatar: '⚡',
      level: 42,
      totalXP: 98000,
      coins: 3500,
      achievements: 20,
      lastActivityDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      bio: 'Velocidade é arte',
    },
    {
      id: 'user-005',
      name: 'Focus Master',
      avatar: '🎯',
      level: 40,
      totalXP: 92000,
      coins: 3200,
      achievements: 19,
      lastActivityDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      bio: 'Sem distrações',
    },
    {
      id: 'user-006',
      name: 'Novo Jogador',
      avatar: '🌱',
      level: 8,
      totalXP: 5000,
      coins: 500,
      achievements: 2,
      lastActivityDate: new Date(Date.now() - 20 * 60 * 1000),
      joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      bio: 'Só começando',
    },
    {
      id: 'user-007',
      name: 'Midnight Coder',
      avatar: '🌙',
      level: 35,
      totalXP: 78000,
      coins: 2800,
      achievements: 17,
      lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
      bio: 'Noturno ativo',
    },
    {
      id: 'user-008',
      name: 'Consistência Pro',
      avatar: '🔥',
      level: 38,
      totalXP: 86000,
      coins: 3100,
      achievements: 21,
      lastActivityDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
      bio: 'Pequenas ações = grandes resultados',
    },
    {
      id: 'user-009',
      name: 'Collector 9000',
      avatar: '🎁',
      level: 32,
      totalXP: 70000,
      coins: 2500,
      achievements: 18,
      lastActivityDate: new Date(Date.now() - 15 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      bio: 'Coleciono tudo',
    },
    {
      id: 'user-010',
      name: 'Eternal Optimist',
      avatar: '😊',
      level: 28,
      totalXP: 62000,
      coins: 2200,
      achievements: 15,
      lastActivityDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      bio: 'Sempre positivo',
    },
  ]);

  /**
   * Usuário atual logado
   */
  currentUserSignal = signal<User>({
    id: 'user-current',
    name: 'Você',
    avatar: '👤',
    level: 25,
    totalXP: 45000,
    coins: 1200,
    achievements: 12,
    lastActivityDate: new Date(),
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    bio: 'Jogador em progresso',
  });

  /**
   * Tipo de ordenação do leaderboard
   */
  sortTypeSignal = signal<'xp' | 'level' | 'achievements'>('xp');

  /**
   * Leaderboard ordenado e com posições
   */
  leaderboard = computed(() => {
    const users = this.usersSignal();
    const sortType = this.sortTypeSignal();

    // Ordenar baseado no tipo
    let sorted = [...users].sort((a, b) => {
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

    // Adicionar rank e medals
    return sorted.map((user, index): LeaderboardEntry => ({
      ...user,
      rank: index + 1,
      medal: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined,
    }));
  });

  /**
   * Posição do usuário atual no ranking
   */
  userRank = computed(() => {
    const leaderboard = this.leaderboard();
    const currentUser = this.currentUserSignal();
    const entry = leaderboard.find((u) => u.id === currentUser.id);
    return entry?.rank || 0;
  });

  /**
   * Top 3 do leaderboard
   */
  top3 = computed(() => {
    return this.leaderboard().slice(0, 3);
  });

  /**
   * Todos os usuários
   */
  getAllUsers(): User[] {
    return this.usersSignal();
  }

  /**
   * Obter usuário por ID
   */
  getUserById(id: string): User | undefined {
    return this.usersSignal().find((u) => u.id === id);
  }

  /**
   * Seguir/Deixar de seguir usuário
   */
  toggleFollow(userId: string): void {
    this.usersSignal.update((users) => {
      return users.map((u) => {
        if (u.id === userId) {
          return { ...u, isFollowed: !u.isFollowed };
        }
        return u;
      });
    });
  }

  /**
   * Atualizar tipo de ordenação
   */
  setSortType(type: 'xp' | 'level' | 'achievements'): void {
    this.sortTypeSignal.set(type);
  }

  /**
   * Buscar usuários por nome
   */
  searchUsers(query: string): User[] {
    if (!query) return this.usersSignal();
    const lowerQuery = query.toLowerCase();
    return this.usersSignal().filter((u) =>
      u.name.toLowerCase().includes(lowerQuery) || u.bio?.toLowerCase().includes(lowerQuery),
    );
  }
}

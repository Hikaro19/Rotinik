import { Injectable, signal, computed } from '@angular/core';

/**
 * Achievement interface
 */
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

/**
 * ProfileStats interface
 */
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
  achievements: Achievement[];
}

/**
 * ActivityDay interface - para heatmap
 */
export interface ActivityDay {
  date: Date;
  completed: boolean;
}

/**
 * ProfileService: Gerencia dados do perfil do usuário
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  /**
   * Achievements do usuário
   */
  achievementsSignal = signal<Achievement[]>([
    {
      id: 'ach-1',
      name: 'Primeira Tarefa',
      description: 'Complete sua primeira tarefa',
      icon: '🎯',
      rarity: 'common',
      unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-2',
      name: 'Streak de 7 Dias',
      description: 'Mantenha a rotina por 7 dias consecutivos',
      icon: '🔥',
      rarity: 'rare',
      unlockedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-3',
      name: 'Colecionador',
      description: 'Compre 5 itens na loja',
      icon: '🎁',
      rarity: 'rare',
      progress: 1,
      target: 5,
    },
    {
      id: 'ach-4',
      name: 'Mestre da Produtividade',
      description: 'Complete 100 tarefas',
      icon: '👑',
      rarity: 'epic',
      progress: 15,
      target: 100,
    },
    {
      id: 'ach-5',
      name: 'Lendário',
      description: 'Chegue ao nível 50',
      icon: '⭐',
      rarity: 'legendary',
      progress: 5,
      target: 50,
    },
  ]);

  /**
   * Histórico de atividade (últimos 90 dias)
   */
  activityHistorySignal = signal<ActivityDay[]>(this.generateActivityHistory());

  /**
   * Membros desde (data de criação)
   */
  memberSinceSignal = signal<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  // ───────────────────────────────────────────────────────────────
  // 📊 COMPUTED
  // ───────────────────────────────────────────────────────────────

  /**
   * Total de achievements desbloqueados
   */
  unlockedAchievements = computed(() => {
    return this.achievementsSignal().filter((a) => a.unlockedDate).length;
  });

  /**
   * Total de achievements
   */
  totalAchievements = computed(() => {
    return this.achievementsSignal().length;
  });

  /**
   * Dias com atividade completada
   */
  activeDays = computed(() => {
    return this.activityHistorySignal().filter((day) => day.completed).length;
  });

  /**
   * Percentual de atividade
   */
  activityPercentage = computed(() => {
    const total = this.activityHistorySignal().length;
    const active = this.activeDays();
    return Math.round((active / total) * 100);
  });

  // ───────────────────────────────────────────────────────────────
  // 🛠️ PRIVATE HELPERS
  // ───────────────────────────────────────────────────────────────

  /**
   * Gera histórico de atividade de 90 dias
   */
  private generateActivityHistory(): ActivityDay[] {
    const days: ActivityDay[] = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        completed: Math.random() > 0.6, // 40% de chance de ter completado
      });
    }
    return days;
  }

  /**
   * Dias desde o início
   */
  daysSinceStart = computed(() => {
    const today = new Date();
    const start = this.memberSinceSignal();
    const diff = today.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });

  /**
   * Atividade da últimas 7 dias
   */
  last7DaysActivity = computed(() => {
    return this.activityHistorySignal().slice(-7);
  });

  /**
   * Atividade do mês corrente
   */
  currentMonthActivity = computed(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return this.activityHistorySignal().filter((day) => {
      return day.date.getMonth() === currentMonth && day.date.getFullYear() === currentYear;
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 🎯 ACHIEVEMENT METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Obter todos os achievements
   */
  getAchievements(): Achievement[] {
    return this.achievementsSignal();
  }

  /**
   * Obter achievements desbloqueados
   */
  getUnlockedAchievements(): Achievement[] {
    return this.achievementsSignal().filter((a) => a.unlockedDate);
  }

  /**
   * Obter achievements em progresso
   */
  getInProgressAchievements(): Achievement[] {
    return this.achievementsSignal().filter((a) => !a.unlockedDate && a.progress);
  }

  /**
   * Desbloquear achievement
   */
  unlockAchievement(achievementId: string): void {
    this.achievementsSignal.update((achievements) => {
      return achievements.map((a) => {
        if (a.id === achievementId && !a.unlockedDate) {
          return { ...a, unlockedDate: new Date() };
        }
        return a;
      });
    });
  }

  /**
   * Atualizar progresso de achievement
   */
  updateAchievementProgress(achievementId: string, progress: number): void {
    this.achievementsSignal.update((achievements) => {
      return achievements.map((a) => {
        if (a.id === achievementId) {
          const updated = { ...a, progress };
          // Auto-unlock se atingir o target
          if (a.target && progress >= a.target && !a.unlockedDate) {
            updated.unlockedDate = new Date();
          }
          return updated;
        }
        return a;
      });
    });
  }

  // ───────────────────────────────────────────────────────────────
  // 📅 ACTIVITY METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Obter histórico de atividade
   */
  getActivityHistory(): ActivityDay[] {
    return this.activityHistorySignal();
  }

  /**
   * Marcar dia como completo
   */
  completeDay(date: Date): void {
    this.activityHistorySignal.update((history) => {
      return history.map((day) => {
        if (day.date.toDateString() === date.toDateString()) {
          return { ...day, completed: true };
        }
        return day;
      });
    });
  }

  /**
   * Reset do perfil (desenvolvimento)
   */
  resetProfile(): void {
    this.achievementsSignal.set([]);
    this.activityHistorySignal.set([]);
  }
}

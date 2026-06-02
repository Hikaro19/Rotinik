import { Injectable, computed, inject, signal } from '@angular/core';
import { RoutineService } from '@core/services/routine.service';

/**
 * Interface de usuario com stats gamificados.
 */
export interface GamePlayer {
  id: string;
  name: string;
  userName: string;
  email: string;
  level: number;
  currentXP: number;
  totalXP: number;
  coins: number;
  achievements: string[];
  lastActivityDate: Date;
}

/**
 * Interface de transacao de moedas/XP.
 */
export interface GameTransaction {
  id: string;
  type: 'earn_xp' | 'spend_coin' | 'earn_coin' | 'level_up';
  amount: number;
  reason: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly routineService = inject(RoutineService);
  private readonly achievementIdsSignal = signal<string[]>([]);

  // CORREÇÃO: acessa propriedades do DTO diretamente (era: user.getNivel(), user.getNome()
  // que são métodos da classe de domínio Usuario — não mais usada aqui)
  readonly playerSignal = computed<GamePlayer>(() => {
    const user = this.routineService.currentUserSignal();

    return {
      id: user?.id ?? 'user-001',
      name: user?.name ?? 'Jogador',
      userName: user?.userName ?? 'jogador',
      email: user?.email ?? 'player@rotinik.com',
      level: user?.level ?? 1,
      currentXP: user?.currentXp ?? 0,
      totalXP: user?.totalXp ?? 0,
      coins: user?.coins ?? 0,
      achievements: this.achievementIdsSignal(),
      lastActivityDate: user?.lastActivityAt ? new Date(user.lastActivityAt) : new Date(),
    };
  });

  readonly transactionsSignal = signal<GameTransaction[]>([]);

  readonly xpToNextLevel = computed(() => this.routineService.xpToNextLevel());
  readonly xpProgress = computed(() => this.routineService.userLevelProgress());
  readonly levelStatus = computed(() => {
    const level = this.playerSignal().level;
    if (level === 1) return 'starter';
    if (level <= 5) return 'apprentice';
    if (level <= 10) return 'expert';
    if (level <= 20) return 'master';
    return 'elite';
  });
  readonly levelColor = computed(() => {
    const status = this.levelStatus();
    const colorMap: Record<string, string> = {
      starter: 'var(--text-muted)',
      apprentice: 'var(--brand-neon)',
      expert: 'var(--game-coin)',
      master: 'var(--game-elite)',
      elite: 'var(--brand-neon)',
    };
    return colorMap[status] || 'var(--text-body)';
  });

  addXP(_amount: number, _reason: string = 'Tarefa completada'): void {
    // XP e aplicado pela fonte unica de rotinas ao concluir tarefas.
  }

  resetLevelXP(): void {
    // Mantido por compatibilidade; a regra real vem da fonte unica.
  }

  addCoins(amount: number, reason: string = 'Ganho'): void {
    this.currentUserSignal_update((user) => user ? { ...user, coins: (user.coins || 0) + amount } : user);
    this.logTransaction('earn_coin', amount, reason);
  }

  spendCoins(amount: number, reason: string = 'Gasto'): boolean {
    const player = this.playerSignal();
    if (player.coins < amount) {
      console.warn('Moedas insuficientes');
      return false;
    }

    this.currentUserSignal_update((user) => user ? { ...user, coins: (user.coins || 0) - amount } : user);
    this.logTransaction('spend_coin', amount, reason);
    return true;
  }

  canAfford(cost: number): boolean {
    return this.playerSignal().coins >= cost;
  }

  unlockAchievement(achievementId: string): void {
    if (this.hasAchievement(achievementId)) return;
    this.achievementIdsSignal.update((ids) => [...ids, achievementId]);
  }

  hasAchievement(achievementId: string): boolean {
    return this.achievementIdsSignal().includes(achievementId);
  }

  getTransactionHistory(limit: number = 10): GameTransaction[] {
    return this.transactionsSignal().slice(0, limit);
  }

  getPlayerStats() {
    const player = this.playerSignal();
    return {
      level: player.level,
      currentXP: player.currentXP,
      nextLevelXP: this.xpToNextLevel(),
      xpProgress: this.xpProgress(),
      coins: player.coins,
      achievementCount: player.achievements.length,
      totalXP: player.totalXP,
      status: this.levelStatus(),
    };
  }

  resetPlayer(): void {
    this.achievementIdsSignal.set([]);
    this.transactionsSignal.set([]);
    this.routineService.resetState();
  }

  private logTransaction(type: GameTransaction['type'], amount: number, reason: string): void {
    const transaction: GameTransaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      reason,
      timestamp: new Date(),
    };

    this.transactionsSignal.update((transactions) => {
      const updated = [transaction, ...transactions];
      return updated.length > 100 ? updated.slice(0, 100) : updated;
    });
  }

  // Delega a mutação de moedas ao RoutineService (fonte única de verdade do user)
  private currentUserSignal_update(
    updater: (user: ReturnType<typeof this.routineService.currentUserSignal>) => ReturnType<typeof this.routineService.currentUserSignal>
  ): void {
    this.routineService.currentUserSignal.update(updater);
  }
}

import { Injectable, signal, computed } from '@angular/core';

/**
 * Interface de usuário com stats gamificados
 */
export interface GamePlayer {
  id: string;
  name: string;
  email: string;
  level: number;
  currentXP: number;
  totalXP: number;
  coins: number;
  achievements: string[];
  lastActivityDate: Date;
}

/**
 * Interface de transação de moedas/XP
 */
export interface GameTransaction {
  id: string;
  type: 'earn_xp' | 'spend_coin' | 'earn_coin' | 'level_up';
  amount: number;
  reason: string;
  timestamp: Date;
}

/**
 * GamificationService: Gerencia XP, moedas, níveis e achievements
 * Usa Signals para reatividade em tempo real
 */
@Injectable({ providedIn: 'root' })
export class GamificationService {
  // ───────────────────────────────────────────────────────────────
  // 🎮 SIGNALS (Estado)
  // ───────────────────────────────────────────────────────────────

  // Player state
  playerSignal = signal<GamePlayer>({
    id: 'user-001',
    name: 'Jogador',
    email: 'player@rotinik.com',
    level: 1,
    currentXP: 0,
    totalXP: 0,
    coins: 100, // Moedas iniciais
    achievements: [],
    lastActivityDate: new Date(),
  });

  // Transaction history
  transactionsSignal = signal<GameTransaction[]>([]);

  // ───────────────────────────────────────────────────────────────
  // 📊 COMPUTED (Dados Derivados)
  // ───────────────────────────────────────────────────────────────

  /**
   * XP necessário para passar de nível
   * Fórmula: 100 * nível^1.5
   */
  xpToNextLevel = computed(() => {
    const level = this.playerSignal().level;
    return Math.floor(100 * Math.pow(level, 1.5));
  });

  /**
   * Progresso da barra de XP (0-100)
   */
  xpProgress = computed(() => {
    const player = this.playerSignal();
    const nextLevel = this.xpToNextLevel();
    const progress = (player.currentXP / nextLevel) * 100;
    return Math.min(100, progress);
  });

  /**
   * Status do nível (compatível com design system)
   */
  levelStatus = computed(() => {
    const level = this.playerSignal().level;
    if (level === 1) return 'starter';
    if (level <= 5) return 'apprentice';
    if (level <= 10) return 'expert';
    if (level <= 20) return 'master';
    return 'elite';
  });

  /**
   * Cor do nível baseado em rarity
   */
  levelColor = computed(() => {
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

  // ───────────────────────────────────────────────────────────────
  // 🎯 XP & LEVEL METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Adiciona XP ao player
   * Verifica se passou de nível
   */
  addXP(amount: number, reason: string = 'Tarefa completada'): void {
    const player = this.playerSignal();
    const nextLevelXP = this.xpToNextLevel();

    let newXP = player.currentXP + amount;
    let newLevel = player.level;
    let newTotalXP = player.totalXP + amount;

    // Verificar se passou de nível
    while (newXP >= nextLevelXP && newLevel < 100) {
      newXP -= nextLevelXP;
      newLevel++;
    }

    // Atualizar player
    this.playerSignal.set({
      ...player,
      level: newLevel,
      currentXP: newXP,
      totalXP: newTotalXP,
      lastActivityDate: new Date(),
    });

    // Registrar transação
    this.logTransaction('earn_xp', amount, reason);

    // Efeito sonoro (simulado)
    if (newLevel > player.level) {
      console.log(`🎉 LEVEL UP! Você é nível ${newLevel}!`);
    } else {
      console.log(`⭐ +${amount} XP`);
    }
  }

  /**
   * Reseta XP do nível atual
   */
  resetLevelXP(): void {
    const player = this.playerSignal();
    this.playerSignal.set({
      ...player,
      currentXP: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────
  // 💰 COIN METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Adiciona moedas
   */
  addCoins(amount: number, reason: string = 'Ganho'): void {
    const player = this.playerSignal();
    this.playerSignal.set({
      ...player,
      coins: player.coins + amount,
      lastActivityDate: new Date(),
    });

    this.logTransaction('earn_coin', amount, reason);
    console.log(`💰 +${amount} moedas`);
  }

  /**
   * Gasta moedas
   * Retorna true se conseguiu gastar, false se insuficiente
   */
  spendCoins(amount: number, reason: string = 'Gasto'): boolean {
    const player = this.playerSignal();

    if (player.coins < amount) {
      console.warn('❌ Moedas insuficientes');
      return false;
    }

    this.playerSignal.set({
      ...player,
      coins: player.coins - amount,
      lastActivityDate: new Date(),
    });

    this.logTransaction('spend_coin', amount, reason);
    console.log(`💸 -${amount} moedas`);
    return true;
  }

  /**
   * Retorna disponibilidade de moedas para compra
   */
  canAfford(cost: number): boolean {
    return this.playerSignal().coins >= cost;
  }

  // ───────────────────────────────────────────────────────────────
  // 🏆 ACHIEVEMENTS METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Desbloqueia um achievement
   */
  unlockAchievement(achievementId: string): void {
    const player = this.playerSignal();

    if (player.achievements.includes(achievementId)) {
      return; // Já desbloqueado
    }

    this.playerSignal.set({
      ...player,
      achievements: [...player.achievements, achievementId],
      lastActivityDate: new Date(),
    });

    console.log(`🏅 Achievement desbloqueado: ${achievementId}`);
  }

  /**
   * Verifica se tem achievement
   */
  hasAchievement(achievementId: string): boolean {
    return this.playerSignal().achievements.includes(achievementId);
  }

  // ───────────────────────────────────────────────────────────────
  // 📝 TRANSACTION HISTORY
  // ───────────────────────────────────────────────────────────────

  /**
   * Registra transação no histórico
   */
  private logTransaction(type: GameTransaction['type'], amount: number, reason: string): void {
    const transaction: GameTransaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      reason,
      timestamp: new Date(),
    };

    this.transactionsSignal.update((txs) => {
      const updated = [transaction, ...txs];
      return updated.length > 100 ? updated.slice(0, 100) : updated;
    });
  }

  /**
   * Retorna últimas transações
   */
  getTransactionHistory(limit: number = 10): GameTransaction[] {
    return this.transactionsSignal().slice(0, limit);
  }

  // ───────────────────────────────────────────────────────────────
  // 📊 STATS METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Retorna stats resumidos para display
   */
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

  /**
   * Reset completo (para desenvolvimento)
   */
  resetPlayer(): void {
    this.playerSignal.set({
      id: 'user-001',
      name: 'Jogador',
      email: 'player@rotinik.com',
      level: 1,
      currentXP: 0,
      totalXP: 0,
      coins: 100,
      achievements: [],
      lastActivityDate: new Date(),
    });
    this.transactionsSignal.set([]);
  }
}

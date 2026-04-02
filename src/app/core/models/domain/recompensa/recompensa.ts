/**
 * 🎁 Classe Recompensa (com Padrão Factory)
 * Encapsula criação de recompensas com diferentes tipos e raridades
 */

import { ETipoRecompensa, ERaridade, EDificuldadeTarefa } from '../enums/recompensa.enum';

export class Recompensa {
  private constructor(
    private readonly tipo: ETipoRecompensa,
    private readonly valor: number,
    private readonly raridade: ERaridade
  ) {
    if (valor < 0) throw new Error('Valor não pode ser negativo');
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getTipo(): ETipoRecompensa {
    return this.tipo;
  }

  getValor(): number {
    return this.valor;
  }

  getRaridade(): ERaridade {
    return this.raridade;
  }

  /**
   * Calcula multiplicador baseado em raridade
   * Comum: 1x, Raro: 1.5x, Épico: 2x, Lendário: 3x
   */
  getMultiplicadorRaridade(): number {
    const multiplicadores: Record<ERaridade, number> = {
      [ERaridade.COMUM]: 1,
      [ERaridade.RARO]: 1.5,
      [ERaridade.EPICO]: 2,
      [ERaridade.LENDARIO]: 3,
    };
    return multiplicadores[this.raridade];
  }

  /**
   * Calcula valor final considerando raridade
   */
  getValorFinal(): number {
    return Math.floor(this.valor * this.getMultiplicadorRaridade());
  }

  // ─────────────────────────────────────────────────────────────
  // FACTORY METHODS (Static)
  // ─────────────────────────────────────────────────────────────

  /**
   * Cria recompensa de XP simples
   */
  static criarXP(valor: number, raridade: ERaridade = ERaridade.COMUM): Recompensa {
    return new Recompensa(ETipoRecompensa.XP, valor, raridade);
  }

  /**
   * Cria recompensa de moedas
   */
  static criarMoeda(valor: number, raridade: ERaridade = ERaridade.COMUM): Recompensa {
    return new Recompensa(ETipoRecompensa.MOEDA, valor, raridade);
  }

  /**
   * Cria recompensa de achievement
   */
  static criarAchievement(raridade: ERaridade = ERaridade.RARO): Recompensa {
    return new Recompensa(ETipoRecompensa.ACHIEVEMENT, 1, raridade);
  }

  /**
   * Factory por dificuldade de tarefa
   * Define XP baseado no nível de dificuldade
   */
  static criarPorDificuldade(
    dificuldade: EDificuldadeTarefa,
    modificador: number = 1
  ): Recompensa {
    const configuracao = {
      [EDificuldadeTarefa.FACIL]: { xp: 10, raridade: ERaridade.COMUM },
      [EDificuldadeTarefa.MEDIA]: { xp: 25, raridade: ERaridade.RARO },
      [EDificuldadeTarefa.DIFICIL]: { xp: 50, raridade: ERaridade.EPICO },
    };

    const config = configuracao[dificuldade];
    const xpFinal = Math.floor(config.xp * modificador);

    return Recompensa.criarXP(xpFinal, config.raridade);
  }

  /**
   * Factory para criar recompensa especial (item loja)
   */
  static criarItemEspecial(valor: number, raridade: ERaridade = ERaridade.RARO): Recompensa {
    return new Recompensa(ETipoRecompensa.ITEM_ESPECIAL, valor, raridade);
  }
}

/**
 * 📊 Padrão Strategy - Cálculo de Progresso de Rotinas
 * Permite diferentes estratégias de cálculo de progresso
 */

import type { Rotina } from './rotina';
import { Tarefa } from './tarefa/tarefa';

/**
 * Interface de Strategy para calcular progresso
 */
export interface ICalculadorProgresso {
  /**
   * Calcula progresso em porcentagem (0-100)
   */
  calcular(rotina: Rotina): number;

  /**
   * Retorna nome da estratégia
   */
  obterNome(): string;
}

/**
 * Estratégia Linear: calcula baseado em quantidade de tarefas
 * Exemplo: 2/4 tarefas completas = 50%
 */
export class EstrategiaProgresoLinear implements ICalculadorProgresso {
  calcular(rotina: Rotina): number {
    const tarefas = rotina.getTarefas();
    if (tarefas.length === 0) return 0;

    const tarefasCompletas = tarefas.filter((t) => t.ehCompleta()).length;
    return Math.round((tarefasCompletas / tarefas.length) * 100);
  }

  obterNome(): string {
    return 'Linear';
  }
}

/**
 * Estratégia Com Peso: calcula baseado em pontos (XP) das tarefas
 * Exemplo: Tarefa 1 (10 XP) completa, Tarefa 2 (30 XP) não = 25%
 */
export class EstrategiaProgresoComPeso implements ICalculadorProgresso {
  calcular(rotina: Rotina): number {
    const tarefas = rotina.getTarefas();
    if (tarefas.length === 0) return 0;

    const pesoTotal = tarefas.reduce((sum, t) => sum + t.getXPRecompensa(), 0);
    if (pesoTotal === 0) return 0;

    const pesoConcluido = tarefas
      .filter((t) => t.ehCompleta())
      .reduce((sum, t) => sum + t.getXPRecompensa(), 0);

    return Math.round((pesoConcluido / pesoTotal) * 100);
  }

  obterNome(): string {
    return 'Com Peso';
  }
}

/**
 * Estratégia Exponencial: dá mais peso às tarefas difíceis
 * Útil para gamificação onde difícil = mais satisfação
 */
export class EstrategiaProgresoExponencial implements ICalculadorProgresso {
  calcular(rotina: Rotina): number {
    const tarefas = rotina.getTarefas();
    if (tarefas.length === 0) return 0;

    let pesoTotal = 0;
    let pesoConcluido = 0;

    tarefas.forEach((tarefa) => {
      const peso = this.calcularPesoTarefa(tarefa);
      pesoTotal += peso;

      if (tarefa.ehCompleta()) {
        pesoConcluido += peso;
      }
    });

    if (pesoTotal === 0) return 0;
    return Math.round((pesoConcluido / pesoTotal) * 100);
  }

  private calcularPesoTarefa(tarefa: Tarefa): number {
    // Quanto maior o XP, maior o peso
    return Math.pow(tarefa.getXPRecompensa() / 10, 1.5);
  }

  obterNome(): string {
    return 'Exponencial';
  }
}

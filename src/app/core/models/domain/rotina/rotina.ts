/**
 * 🔄 Classe Rotina
 * Agregado que gerencia tarefas e calcula progresso
 */

import { v4 as uuid } from 'uuid';
import { Tarefa } from './tarefa/tarefa';
import {
  ICalculadorProgresso,
  EstrategiaProgresoLinear,
} from './rotina-strategy';
import { EFrequencia } from '../enums/rotina.enum';

export class Rotina {
  private readonly id: string;
  private titulo: string;
  private descricao: string;
  private frequencia: EFrequencia;
  private tarefas: Tarefa[] = [];
  private dataCriacao: Date;
  private ultimoCompletamento?: Date;
  private sequenciaCompletamento: number = 0;
  private estrategiaProgresso: ICalculadorProgresso = new EstrategiaProgresoLinear();

  constructor(
    titulo: string,
    descricao: string,
    frequencia: EFrequencia = EFrequencia.DIARIA
  ) {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título da rotina não pode estar vazio');
    }

    this.id = uuid();
    this.titulo = titulo;
    this.descricao = descricao;
    this.frequencia = frequencia;
    this.dataCriacao = new Date();
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getId(): string {
    return this.id;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getDescricao(): string {
    return this.descricao;
  }

  getFrequencia(): EFrequencia {
    return this.frequencia;
  }

  getTarefas(): Tarefa[] {
    return [...this.tarefas]; // Retorna cópia para imutabilidade
  }

  getSequenciaCompletamento(): number {
    return this.sequenciaCompletamento;
  }

  getUltimoCompletamento(): Date | undefined {
    return this.ultimoCompletamento ? new Date(this.ultimoCompletamento) : undefined;
  }

  getDataCriacao(): Date {
    return new Date(this.dataCriacao);
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO RICO
  // ─────────────────────────────────────────────────────────────

  /**
   * Calcula progresso da rotina baseado na estratégia
   */
  calcularProgresso(): number {
    return this.estrategiaProgresso.calcular(this);
  }

  /**
   * Adiciona uma tarefa à rotina
   */
  adicionarTarefa(tarefa: Tarefa): void {
    if (!tarefa) {
      throw new Error('Tarefa não pode ser nula');
    }

    if (this.tarefas.some((t) => t.getId() === tarefa.getId())) {
      throw new Error('Tarefa já existe nesta rotina');
    }

    this.tarefas.push(tarefa);
  }

  /**
   * Remove uma tarefa da rotina
   */
  removerTarefa(tarefaId: string): boolean {
    const index = this.tarefas.findIndex((t) => t.getId() === tarefaId);
    if (index >= 0) {
      this.tarefas.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Obtém tarefa específica
   */
  obterTarefa(tarefaId: string): Tarefa | undefined {
    return this.tarefas.find((t) => t.getId() === tarefaId);
  }

  /**
   * Marca rotina como completa
   * Valiada se todas as tarefas foram completas
   */
  marcarCompleta(): void {
    const todasCompletas = this.tarefas.every((t) => t.ehCompleta());

    if (!todasCompletas) {
      const pendentes = this.tarefas.filter((t) => !t.ehCompleta());
      throw new Error(
        `❌ Nem todas as tarefas foram completadas. Faltam ${pendentes.length} tarefas.`
      );
    }

    this.ultimoCompletamento = new Date();
    this.sequenciaCompletamento++;
    console.log(
      `🎉 Rotina "${this.titulo}" completada! Sequência: ${this.sequenciaCompletamento} 🔥`
    );
  }

  /**
   * Calcula XP total da rotina (soma de todas as tarefas)
   */
  calcularXPTotal(): number {
    return this.tarefas.reduce((sum, tarefa) => sum + tarefa.getXPRecompensa(), 0);
  }

  /**
   * Calcula moedas totais da rotina
   */
  calcularMoedasTotal(): number {
    return this.tarefas.reduce((sum, tarefa) => sum + tarefa.getMoedasRecompensa(), 0);
  }

  /**
   * Calcula XP das tarefas concluídas
   */
  calcularXPConcluido(): number {
    return this.tarefas
      .filter((t) => t.ehCompleta())
      .reduce((sum, tarefa) => sum + tarefa.getXPRecompensa(), 0);
  }

  /**
   * Conta tarefas por estado
   */
  contarTarefasPorEstado(): {
    pendente: number;
    emAndamento: number;
    concluida: number;
  } {
    return {
      pendente: this.tarefas.filter((t) => t.ehPendente()).length,
      emAndamento: this.tarefas.filter((t) => t.ehEmAndamento()).length,
      concluida: this.tarefas.filter((t) => t.ehCompleta()).length,
    };
  }

  /**
   * Define estratégia de cálculo de progresso
   */
  setEstrategiaProgresso(estrategia: ICalculadorProgresso): void {
    if (!estrategia) {
      throw new Error('Estratégia não pode ser nula');
    }
    this.estrategiaProgresso = estrategia;
  }

  /**
   * Atualiza título e descrição
   */
  atualizar(titulo: string, descricao: string): void {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título não pode estar vazio');
    }
    this.titulo = titulo;
    this.descricao = descricao;
  }
}

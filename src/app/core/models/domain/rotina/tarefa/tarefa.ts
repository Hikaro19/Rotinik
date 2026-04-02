/**
 * 🎯 Classe Tarefa (com Padrão State)
 * Representa uma tarefa com estado gerenciado e recompensas
 */

import { v4 as uuid } from 'uuid';
import {
  ITarefaState,
  TarefaPendente,
  ETarefaEstado,
} from './tarefa-state';
import { EDificuldadeTarefa } from '../../enums/recompensa.enum';
import { Recompensa } from '../../recompensa/recompensa';

export class Tarefa {
  private readonly id: string;
  private titulo: string;
  private descricao: string;
  private xpRecompensa: number;
  private moedasRecompensa: number;
  private estado: ITarefaState;
  private dificuldade: EDificuldadeTarefa;
  private dataCriacao: Date;
  private dataConclusao?: Date;
  private dataInicio?: Date;

  constructor(
    titulo: string,
    descricao: string,
    xpRecompensa: number,
    moedasRecompensa: number,
    dificuldade: EDificuldadeTarefa = EDificuldadeTarefa.MEDIA
  ) {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título da tarefa não pode estar vazio');
    }
    if (xpRecompensa < 0 || moedasRecompensa < 0) {
      throw new Error('Recompensas não podem ser negativas');
    }

    this.id = uuid();
    this.titulo = titulo;
    this.descricao = descricao;
    this.xpRecompensa = xpRecompensa;
    this.moedasRecompensa = moedasRecompensa;
    this.dificuldade = dificuldade;
    this.estado = new TarefaPendente(); // Estado inicial
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

  getXPRecompensa(): number {
    return this.xpRecompensa;
  }

  getMoedasRecompensa(): number {
    return this.moedasRecompensa;
  }

  getEstado(): string {
    return this.estado.obterNome();
  }

  getEstadoEnum(): ETarefaEstado {
    return this.estado.obterEstado();
  }

  getDificuldade(): EDificuldadeTarefa {
    return this.dificuldade;
  }

  getDataCriacao(): Date {
    return new Date(this.dataCriacao);
  }

  getDataConclusao(): Date | undefined {
    return this.dataConclusao ? new Date(this.dataConclusao) : undefined;
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO - DELEGA PARA ESTADO (Padrão State)
  // ─────────────────────────────────────────────────────────────

  /**
   * Conclui a tarefa (delega para estado)
   */
  concluir(): void {
    this.estado.concluir(this);
  }

  /**
   * Inicia a tarefa (delega para estado)
   */
  iniciar(): void {
    this.dataInicio = new Date();
    this.estado.iniciar(this);
  }

  /**
   * Volta para pendente (delega para estado)
   */
  voltarParaPendente(): void {
    this.estado.pendente(this);
    this.dataInicio = undefined;
  }

  /**
   * Calcula pontos totais (XP + Moedas)
   */
  calcularPontosTotais(): number {
    return this.xpRecompensa + this.moedasRecompensa;
  }

  /**
   * Cria uma recompensa baseada na tarefa
   */
  criarRecompensa(): Recompensa {
    return Recompensa.criarPorDificuldade(this.dificuldade, 1);
  }

  /**
   * Verifica se está completa
   */
  ehCompleta(): boolean {
    return this.estado.obterEstado() === ETarefaEstado.CONCLUIDA;
  }

  /**
   * Verifica se está em andamento
   */
  ehEmAndamento(): boolean {
    return this.estado.obterEstado() === ETarefaEstado.EM_ANDAMENTO;
  }

  /**
   * Verifica se está pendente
   */
  ehPendente(): boolean {
    return this.estado.obterEstado() === ETarefaEstado.PENDENTE;
  }

  // ─────────────────────────────────────────────────────────────
  // MÉTODOS INTERNOS (package-private via convenção)
  // ─────────────────────────────────────────────────────────────

  /**
   * Muda o estado interno (usado somente pelos estados)
   * @internal
   */
  mudarEstado(novoEstado: ITarefaState): void {
    this.estado = novoEstado;

    // Registra conclusão
    if (this.ehCompleta()) {
      this.dataConclusao = new Date();
    }
  }

  /**
   * Atualiza descrição
   */
  atualizarDescricao(novaDescricao: string): void {
    if (!novaDescricao) throw new Error('Descrição não pode estar vazia');
    this.descricao = novaDescricao;
  }

  /**
   * Atualiza recompensa de XP
   */
  atualizarXPRecompensa(novoXP: number): void {
    if (novoXP < 0) throw new Error('XP não pode ser negativo');
    this.xpRecompensa = novoXP;
  }

  /**
   * Atualiza recompensa de moedas
   */
  atualizarMoedasRecompensa(novasMoedas: number): void {
    if (novasMoedas < 0) throw new Error('Moedas não podem ser negativas');
    this.moedasRecompensa = novasMoedas;
  }
}

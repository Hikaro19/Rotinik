/**
 * 👤 Classe Usuario (Aggregado Root)
 * Entidade raiz que gerencia todos os aspectos do usuário
 * Encapsula: Perfil, Rotinas, Recompensas, Stats
 */

import { v4 as uuid } from 'uuid';
import { Rotina } from '../rotina/rotina';
import { Recompensa } from '../recompensa/recompensa';
import { ItemLoja } from '../loja/item-loja';
import { Perfil } from '../perfil/perfil';

export class Usuario {
  private readonly id: string;
  private nome: string;
  private email: string;
  private nivelAtual: number = 1;
  private experienciaAtual: number = 0;
  private experienciaTotal: number = 0;
  private moedas: number = 100; // Moedas iniciais para MVP
  private rotinas: Rotina[] = [];
  private perfil: Perfil;
  private dataCriacao: Date = new Date();
  private ultimaAtividade: Date = new Date();

  constructor(nome: string, email: string) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do usuário não pode estar vazio');
    }
    if (!email || !this.validarEmail(email)) {
      throw new Error('Email inválido');
    }

    this.id = uuid();
    this.nome = nome;
    this.email = email;
    this.perfil = new Perfil(nome);
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS (Leitura Pública)
  // ─────────────────────────────────────────────────────────────

  getId(): string {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getEmail(): string {
    return this.email;
  }

  getNivel(): number {
    return this.nivelAtual;
  }

  getExperiencia(): number {
    return this.experienciaAtual;
  }

  getExperienciaTotal(): number {
    return this.experienciaTotal;
  }

  getMoedas(): number {
    return this.moedas;
  }

  getRotinas(): Rotina[] {
    return [...this.rotinas]; // Retorna cópia para imutabilidade
  }

  getPerfil(): Perfil {
    return this.perfil;
  }

  getDataCriacao(): Date {
    return new Date(this.dataCriacao);
  }

  getUltimaAtividade(): Date {
    return new Date(this.ultimaAtividade);
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO RICO - XP E NÍVEIS
  // ─────────────────────────────────────────────────────────────

  /**
   * Adiciona XP e verifica level up
   * Fórmula: XP para próximo nível = 100 * nível^1.5
   */
  adicionarXP(xp: number, motivo: string = 'Tarefa completada'): void {
    if (xp < 0) {
      throw new Error('XP não pode ser negativo');
    }

    const xpParaProximo = this.calcularXPParaProximo();
    this.experienciaAtual += xp;
    this.experienciaTotal += xp;
    this.registrarAtividade();

    // Verificar level up (pode fazer multiplos)
    while (this.experienciaAtual >= xpParaProximo && this.nivelAtual < 100) {
      this.experienciaAtual -= xpParaProximo;
      this.nivelAtual++;
      this.moedas += 50; // Bonus de moedas ao passar de nível
      console.log(`🎉 ${this.nome} atingiu nível ${this.nivelAtual}!`);
    }

    console.log(`⭐ ${this.nome} ganhou ${xp} XP. ${motivo}`);
  }

  /**
   * Calcula progresso até o próximo nível (0-100%)
   */
  calcularProgressoNivel(): number {
    const xpParaProximo = this.calcularXPParaProximo();
    if (xpParaProximo === 0) return 0;
    return Math.round((this.experienciaAtual / xpParaProximo) * 100);
  }

  /**
   * Calcula XP necessário para o próximo nível
   * Fórmula: 100 * nível^1.5
   */
  private calcularXPParaProximo(): number {
    return Math.floor(100 * Math.pow(this.nivelAtual, 1.5));
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO RICO - MOEDAS E COMPRAS
  // ─────────────────────────────────────────────────────────────

  /**
   * Gasta moedas (com validação)
   * Retorna true se conseguiu gastar, false se moedas insuficientes
   */
  gastarMoedas(valor: number): boolean {
    if (valor < 0) {
      throw new Error('Valor não pode ser negativo');
    }

    if (this.moedas < valor) {
      console.warn(
        `❌ ${this.nome} não tem moedas suficientes. Tem ${this.moedas}, precisa de ${valor}`
      );
      return false;
    }

    this.moedas -= valor;
    this.registrarAtividade();
    return true;
  }

  /**
   * Ganha moedas (ex: recompensa)
   */
  ganharMoedas(valor: number): void {
    if (valor < 0) {
      throw new Error('Valor não pode ser negativo');
    }

    this.moedas += valor;
    this.registrarAtividade();
    console.log(`💰 ${this.nome} ganhou ${valor} moedas!`);
  }

  /**
   * Compra um item da loja
   */
  comprarItem(item: ItemLoja): boolean {
    if (!item.podeComprar(this)) {
      console.warn(
        `❌ ${this.nome} não pode comprar ${item.getNome()}. Moedas insuficientes.`
      );
      return false;
    }

    if (!this.gastarMoedas(item.getPreco())) {
      return false;
    }

    // TODO: Adicionar item ao inventário do usuário
    console.log(`✅ ${this.nome} comprou: ${item.getNome()}`);
    this.registrarAtividade();
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO RICO - ROTINAS
  // ─────────────────────────────────────────────────────────────

  /**
   * Adiciona uma rotina do usuário
   */
  adicionarRotina(rotina: Rotina): void {
    if (!rotina) {
      throw new Error('Rotina não pode ser nula');
    }

    if (this.rotinas.some((r) => r.getId() === rotina.getId())) {
      throw new Error('Rotina já existe para este usuário');
    }

    this.rotinas.push(rotina);
    this.registrarAtividade();
    console.log(`✅ Rotina "${rotina.getTitulo()}" adicionada para ${this.nome}`);
  }

  /**
   * Remove uma rotina
   */
  removerRotina(rotinaId: string): boolean {
    const index = this.rotinas.findIndex((r) => r.getId() === rotinaId);
    if (index >= 0) {
      const rotina = this.rotinas[index];
      this.rotinas.splice(index, 1);
      this.registrarAtividade();
      console.log(`🗑️ Rotina "${rotina.getTitulo()}" removida`);
      return true;
    }
    return false;
  }

  /**
   * Obtém uma rotina específica
   */
  obterRotina(rotinaId: string): Rotina | undefined {
    return this.rotinas.find((r) => r.getId() === rotinaId);
  }

  /**
   * Calcula XP total possível em todas as rotinas
   */
  calcularXPTotalRotinas(): number {
    return this.rotinas.reduce((sum, rotina) => sum + rotina.calcularXPTotal(), 0);
  }

  /**
   * Calcula moedas totais possíveis em todas as rotinas
   */
  calcularMoedasTotalRotinas(): number {
    return this.rotinas.reduce((sum, rotina) => sum + rotina.calcularMoedasTotal(), 0);
  }

  /**
   * Calcula progresso médio de todas as rotinas
   */
  calcularProgressoMedio(): number {
    if (this.rotinas.length === 0) return 0;

    const progresso = this.rotinas.reduce((sum, rotina) => sum + rotina.calcularProgresso(), 0);
    return Math.round(progresso / this.rotinas.length);
  }

  // ─────────────────────────────────────────────────────────────
  // MÉTODOS PRIVADOS / INTERNOS
  // ─────────────────────────────────────────────────────────────

  /**
   * Valida email com regex simples
   */
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Registra última atividade do usuário
   */
  private registrarAtividade(): void {
    this.ultimaAtividade = new Date();
  }

  /**
   * Converte para string para debug
   */
  toString(): string {
    return `👤 ${this.nome} (Nível ${this.nivelAtual} | XP: ${this.experienciaAtual}/${this.calcularXPParaProximo()} | Moedas: ${this.moedas})`;
  }
}

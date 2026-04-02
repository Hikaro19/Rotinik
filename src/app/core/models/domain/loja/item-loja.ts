/**
 * 🎁 Classe ItemLoja
 * Representa um item que pode ser comprado na loja
 */

import { v4 as uuid } from 'uuid';
import { ERaridade } from '../enums/recompensa.enum';
import type { Usuario } from '../usuario/usuario';

export enum ETipoItem {
  AVATAR = 'AVATAR',
  PODER = 'PODER',
  TEMA = 'TEMA',
  BADGE = 'BADGE',
  BONUS = 'BONUS',
}

export class ItemLoja {
  private readonly id: string;
  private nome: string;
  private descricao: string;
  private preco: number; // Em moedas
  private raridade: ERaridade;
  private tipo: ETipoItem;
  private emoji?: string;
  private dataCriacao: Date;

  constructor(
    nome: string,
    descricao: string,
    preco: number,
    raridade: ERaridade,
    tipo: ETipoItem = ETipoItem.BADGE,
    emoji?: string
  ) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do item não pode estar vazio');
    }
    if (preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    this.id = uuid();
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.raridade = raridade;
    this.tipo = tipo;
    this.emoji = emoji;
    this.dataCriacao = new Date();
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getId(): string {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getDescricao(): string {
    return this.descricao;
  }

  getPreco(): number {
    return this.preco;
  }

  getRaridade(): ERaridade {
    return this.raridade;
  }

  getTipo(): ETipoItem {
    return this.tipo;
  }

  getEmoji(): string | undefined {
    return this.emoji;
  }

  getDataCriacao(): Date {
    return new Date(this.dataCriacao);
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO
  // ─────────────────────────────────────────────────────────────

  /**
   * Verifica se usuário pode comprar este item
   */
  podeComprar(usuario: Usuario): boolean {
    return usuario.getMoedas() >= this.preco;
  }

  /**
   * Calcula preço com desconto
   */
  calcularPrecoComDesconto(percentualDesconto: number): number {
    if (percentualDesconto < 0 || percentualDesconto > 100) {
      throw new Error('Percentual de desconto deve estar entre 0 e 100');
    }
    return Math.floor(this.preco * (1 - percentualDesconto / 100));
  }

  /**
   * Retorna representação em string para exibição
   */
  toString(): string {
    return `${this.emoji || '📦'} ${this.nome} - ${this.preco} moedas (${this.raridade})`;
  }
}

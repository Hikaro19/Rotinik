/**
 * 👤 Classe Perfil
 * Representa o perfil público do usuário com informações sociais
 */

export class Perfil {
  private nome: string;
  private bio: string = '';
  private avatar: string = '👤';
  private nivelReputacao: number = 0;
  private historicoAcoes: string[] = [];
  private dataCriacao: Date = new Date();

  constructor(nome: string) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do perfil não pode estar vazio');
    }
    this.nome = nome;
  }

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────

  getNome(): string {
    return this.nome;
  }

  getBio(): string {
    return this.bio;
  }

  getAvatar(): string {
    return this.avatar;
  }

  getNivelReputacao(): number {
    return this.nivelReputacao;
  }

  getHistorico(): string[] {
    return [...this.historicoAcoes];
  }

  getDataCriacao(): Date {
    return new Date(this.dataCriacao);
  }

  // ─────────────────────────────────────────────────────────────
  // COMPORTAMENTO
  // ─────────────────────────────────────────────────────────────

  /**
   * Atualiza bio do usuário
   */
  atualizarBio(novaBio: string): void {
    if (!novaBio) {
      throw new Error('Bio não pode estar vazia');
    }
    this.bio = novaBio.substring(0, 160); // Limita a 160 caracteres
    this.registrarAcao(`Atualizou bio: "${this.bio}"`);
  }

  /**
   * Atualiza avatar
   */
  atualizarAvatar(novoAvatar: string): void {
    if (!novoAvatar || novoAvatar.length === 0) {
      throw new Error('Avatar não pode estar vazio');
    }
    this.avatar = novoAvatar;
    this.registrarAcao(`Atualizou avatar para ${novoAvatar}`);
  }

  /**
   * Aumenta nível de reputação
   */
  aumentarReputacao(pontos: number = 1): void {
    if (pontos < 0) {
      throw new Error('Pontos de reputação não podem ser negativos');
    }
    this.nivelReputacao += pontos;
    this.registrarAcao(`Ganhou ${pontos} pontos de reputação`);
  }

  /**
   * Registra uma ação no histórico
   */
  private registrarAcao(acao: string): void {
    const timestamp = new Date().toLocaleString('pt-BR');
    this.historicoAcoes.push(`[${timestamp}] ${acao}`);

    // Mantém apenas os últimos 50 registros
    if (this.historicoAcoes.length > 50) {
      this.historicoAcoes = this.historicoAcoes.slice(-50);
    }
  }

  /**
   * Limpa histórico de ações
   */
  limparHistorico(): void {
    this.historicoAcoes = [];
  }
}

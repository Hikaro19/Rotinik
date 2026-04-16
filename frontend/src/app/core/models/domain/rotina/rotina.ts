import { v4 as uuid } from 'uuid';
import { EFrequencia } from '../enums/rotina.enum';
import { Tarefa } from './tarefa/tarefa';
import { EstrategiaProgresoLinear, ICalculadorProgresso } from './rotina-strategy';

export class Rotina {
  private readonly id: string;
  private titulo: string;
  private categoria: string;
  private descricao: string;
  private frequencia: EFrequencia;
  private tarefas: Tarefa[] = [];
  private dataCriacao: Date;
  private ultimoCompletamento?: Date;
  private sequenciaCompletamento = 0;
  private estrategiaProgresso: ICalculadorProgresso = new EstrategiaProgresoLinear();

  constructor(titulo: string, descricao: string, frequencia?: EFrequencia);
  constructor(titulo: string, categoria: string, descricao: string, frequencia?: EFrequencia);
  constructor(
    titulo: string,
    categoriaOuDescricao: string,
    descricaoOuFrequencia?: string | EFrequencia,
    frequencia: EFrequencia = EFrequencia.DIARIA
  ) {
    Rotina.validarTitulo(titulo);

    const assinaturaLegada =
      descricaoOuFrequencia === undefined ||
      Object.values(EFrequencia).includes(descricaoOuFrequencia as EFrequencia);

    const categoria = assinaturaLegada ? 'Geral' : categoriaOuDescricao;
    const descricao = assinaturaLegada ? categoriaOuDescricao : (descricaoOuFrequencia as string);
    const frequenciaFinal = assinaturaLegada
      ? ((descricaoOuFrequencia as EFrequencia | undefined) ?? EFrequencia.DIARIA)
      : frequencia;

    Rotina.validarCategoria(categoria);
    Rotina.validarDescricao(descricao);
    Rotina.validarFrequencia(frequenciaFinal);

    this.id = uuid();
    this.titulo = titulo.trim();
    this.categoria = categoria.trim();
    this.descricao = descricao.trim();
    this.frequencia = frequenciaFinal;
    this.dataCriacao = new Date();
  }

  private static validarTitulo(titulo: string): void {
    if (!titulo || titulo.trim().length < 3) {
      throw new Error('Titulo da rotina deve ter pelo menos 3 caracteres');
    }
  }

  private static validarCategoria(categoria: string): void {
    if (!categoria || categoria.trim().length === 0) {
      throw new Error('Categoria da rotina nao pode estar vazia');
    }
  }

  private static validarDescricao(descricao: string): void {
    if (!descricao || descricao.trim().length === 0) {
      throw new Error('Meta da rotina nao pode estar vazia');
    }
  }

  private static validarFrequencia(frequencia: EFrequencia): void {
    if (!Object.values(EFrequencia).includes(frequencia)) {
      throw new Error('Frequencia da rotina e invalida');
    }
  }

  getId(): string {
    return this.id;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getCategoria(): string {
    return this.categoria;
  }

  getDescricao(): string {
    return this.descricao;
  }

  getFrequencia(): EFrequencia {
    return this.frequencia;
  }

  getTarefas(): Tarefa[] {
    return [...this.tarefas];
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

  calcularProgresso(): number {
    return this.estrategiaProgresso.calcular(this);
  }

  adicionarTarefa(tarefa: Tarefa): void {
    if (!tarefa) {
      throw new Error('Tarefa nao pode ser nula');
    }

    if (this.tarefas.some((item) => item.getId() === tarefa.getId())) {
      throw new Error('Tarefa ja existe nesta rotina');
    }

    this.tarefas.push(tarefa);
  }

  removerTarefa(tarefaId: string): boolean {
    const index = this.tarefas.findIndex((tarefa) => tarefa.getId() === tarefaId);
    if (index >= 0) {
      this.tarefas.splice(index, 1);
      return true;
    }
    return false;
  }

  obterTarefa(tarefaId: string): Tarefa | undefined {
    return this.tarefas.find((tarefa) => tarefa.getId() === tarefaId);
  }

  marcarCompleta(): void {
    const todasCompletas = this.tarefas.every((tarefa) => tarefa.ehCompleta());

    if (!todasCompletas) {
      const pendentes = this.tarefas.filter((tarefa) => !tarefa.ehCompleta());
      throw new Error(`Nem todas as tarefas foram completadas. Faltam ${pendentes.length} tarefas.`);
    }

    this.ultimoCompletamento = new Date();
    this.sequenciaCompletamento++;
  }

  calcularXPTotal(): number {
    return this.tarefas.reduce((sum, tarefa) => sum + tarefa.getXPRecompensa(), 0);
  }

  calcularMoedasTotal(): number {
    return this.tarefas.reduce((sum, tarefa) => sum + tarefa.getMoedasRecompensa(), 0);
  }

  calcularXPConcluido(): number {
    return this.tarefas
      .filter((tarefa) => tarefa.ehCompleta())
      .reduce((sum, tarefa) => sum + tarefa.getXPRecompensa(), 0);
  }

  contarTarefasPorEstado(): {
    pendente: number;
    emAndamento: number;
    concluida: number;
  } {
    return {
      pendente: this.tarefas.filter((tarefa) => tarefa.ehPendente()).length,
      emAndamento: this.tarefas.filter((tarefa) => tarefa.ehEmAndamento()).length,
      concluida: this.tarefas.filter((tarefa) => tarefa.ehCompleta()).length,
    };
  }

  setEstrategiaProgresso(estrategia: ICalculadorProgresso): void {
    if (!estrategia) {
      throw new Error('Estrategia nao pode ser nula');
    }
    this.estrategiaProgresso = estrategia;
  }

  atualizar(titulo: string, descricao: string): void {
    Rotina.validarTitulo(titulo);
    Rotina.validarDescricao(descricao);
    this.titulo = titulo.trim();
    this.descricao = descricao.trim();
  }
}

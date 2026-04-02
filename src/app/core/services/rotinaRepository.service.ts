/**
 * 📚 RotatinaRepository (Singleton)
 * Repositório em memória para Rotinas e Tarefas
 * Implementa padrão Singleton para MVP
 */

import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { 
  Usuario, 
  Rotina, 
  Tarefa, 
  EFrequencia, 
  EDificuldadeTarefa,
  Recompensa 
} from '../models/domain';
import { v4 as uuid } from 'uuid';

/**
 * Interface para seed data inicial
 */
interface SeedData {
  usuario: Usuario;
  rotinas: Rotina[];
}

@Injectable({
  providedIn: 'root',
})
export class RotatinaRepository {
  // ─────────────────────────────────────────────────────────────
  // SINGLETON - Estado Global
  // ─────────────────────────────────────────────────────────────

  private static instance: RotatinaRepository | null = null;
  private usuarioAtualSignal = signal<Usuario | null>(null);
  private rotinasSignal = signal<Rotina[]>([]);

  // ─────────────────────────────────────────────────────────────
  // COMPUTED - Dados Derivados
  // ─────────────────────────────────────────────────────────────

  usuarioAtual = this.usuarioAtualSignal.asReadonly();
  rotinas = this.rotinasSignal.asReadonly();

  totalRotinas = computed(() => this.rotinasSignal().length);
  
  rotinasCompletas = computed(() => 
    this.rotinasSignal().filter(r => r.calcularProgresso() === 100).length
  );

  totalTarefas = computed(() => 
    this.rotinasSignal().reduce((sum, r) => sum + r.getTarefas().length, 0)
  );

  tarefasCompletas = computed(() =>
    this.rotinasSignal().reduce(
      (sum, r) => sum + r.getTarefas().filter(t => t.ehCompleta()).length,
      0
    )
  );

  constructor() {
    // Evita múltiplas instâncias
    if (RotatinaRepository.instance) {
      return RotatinaRepository.instance;
    }
    RotatinaRepository.instance = this;
  }

  // ─────────────────────────────────────────────────────────────
  // SEED DATA - Inicializa Com Dados de Teste
  // ─────────────────────────────────────────────────────────────

  /**
   * Popula repositório com dados de teste
   * Chamado apenas uma vez durante bootstrap da app
   */
  seedData(): void {
    // Criar usuário principal
    const usuario = new Usuario('Hikaro', 'hikaro@rotinik.com');
    usuario.ganharMoedas(50); // Moedas extras para teste

    // ─── ROTINA 1: Estudo de POO II ────────────────────────────
    const rotina1 = new Rotina(
      'Rotina De Estudos',
      'Estudo de Programação Orientada a Objetos',
      EFrequencia.DIARIA
    );

    const tarefa1_1 = new Tarefa(
      'Ler documentação Angular',
      'Estudar componentes standalone',
      15,
      8,
      EDificuldadeTarefa.FACIL
    );

    const tarefa1_2 = new Tarefa(
      'Praticar TypeScript',
      'Resolver exercícios de tipos',
      25,
      12,
      EDificuldadeTarefa.MEDIA
    );

    const tarefa1_3 = new Tarefa(
      'Revisar Padrões de Design',
      'Estudar Factory, State e Strategy',
      50,
      25,
      EDificuldadeTarefa.DIFICIL
    );

    rotina1.adicionarTarefa(tarefa1_1);
    rotina1.adicionarTarefa(tarefa1_2);
    rotina1.adicionarTarefa(tarefa1_3);

    // ─── ROTINA 2: Saúde Física ────────────────────────────────
    const rotina2 = new Rotina(
      'Saúde Física',
      'Exercício e bem-estar',
      EFrequencia.DIARIA
    );

    const tarefa2_1 = new Tarefa(
      'Alongamento matinal',
      '15 minutos de alongamento',
      10,
      5,
      EDificuldadeTarefa.FACIL
    );

    const tarefa2_2 = new Tarefa(
      'Cardio 20 min',
      'Corrida, bicicleta ou natação',
      20,
      10,
      EDificuldadeTarefa.MEDIA
    );

    const tarefa2_3 = new Tarefa(
      'Meditação',
      '10 minutos de meditação',
      15,
      8,
      EDificuldadeTarefa.FACIL
    );

    rotina2.adicionarTarefa(tarefa2_1);
    rotina2.adicionarTarefa(tarefa2_2);
    rotina2.adicionarTarefa(tarefa2_3);

    // ─── ROTINA 3: Leitura ────────────────────────────────────
    const rotina3 = new Rotina(
      'Leitura Diária',
      'Desenvolvimento pessoal e conhecimento',
      EFrequencia.DIARIA
    );

    const tarefa3_1 = new Tarefa(
      'Ler 20 páginas',
      'Livro de desenvolvimento',
      25,
      12,
      EDificuldadeTarefa.MEDIA
    );

    const tarefa3_2 = new Tarefa(
      'Ler artigos tech',
      'Dev.to ou Medium',
      15,
      8,
      EDificuldadeTarefa.FACIL
    );

    rotina3.adicionarTarefa(tarefa3_1);
    rotina3.adicionarTarefa(tarefa3_2);

    // Adicionar rotinas ao usuário
    usuario.adicionarRotina(rotina1);
    usuario.adicionarRotina(rotina2);
    usuario.adicionarRotina(rotina3);

    // Marcar algumas tarefas como completas para teste visual
    tarefa1_1.iniciar();
    tarefa2_1.concluir();
    tarefa3_1.concluir();

    // Adicionar XP ao usuário
    usuario.adicionarXP(100, 'Seed initial XP');

    // ─── INICIALIZAR ESTADO ────────────────────────────────────
    this.usuarioAtualSignal.set(usuario);
    this.rotinasSignal.set([rotina1, rotina2, rotina3]);

    console.log('✅ Seed data inicializada com sucesso!');
    console.log(`👤 Usuário: ${usuario.toString()}`);
    console.log(`📚 Rotinas criadas: ${[rotina1.getTitulo(), rotina2.getTitulo(), rotina3.getTitulo()].join(', ')}`);
  }

  // ─────────────────────────────────────────────────────────────
  // CRUD - ROTINAS
  // ─────────────────────────────────────────────────────────────

  /**
   * Cria uma nova rotina
   */
  criarRotina(titulo: string, descricao: string, frequencia: EFrequencia): Rotina {
    const usuario = this.usuarioAtualSignal();
    if (!usuario) throw new Error('Usuário não autenticado');

    const rotina = new Rotina(titulo, descricao, frequencia);
    usuario.adicionarRotina(rotina);

    this.rotinasSignal.update(rotinas => [...rotinas, rotina]);
    console.log(`✅ Rotina criada: ${rotina.getTitulo()}`);

    return rotina;
  }

  /**
   * Obtém uma rotina por ID
   */
  obterRotina(rotinaId: string): Rotina | undefined {
    return this.rotinasSignal().find(r => r.getId() === rotinaId);
  }

  /**
   * Atualiza uma rotina
   */
  atualizarRotina(rotinaId: string, titulo: string, descricao: string): void {
    const rotina = this.obterRotina(rotinaId);
    if (!rotina) throw new Error('Rotina não encontrada');

    rotina.atualizar(titulo, descricao);
    console.log(`✅ Rotina atualizada: ${rotina.getTitulo()}`);
  }

  /**
   * Deleta uma rotina
   */
  deletarRotina(rotinaId: string): boolean {
    const usuario = this.usuarioAtualSignal();
    if (!usuario) return false;

    const sucesso = usuario.removerRotina(rotinaId);
    if (sucesso) {
      this.rotinasSignal.update(rotinas =>
        rotinas.filter(r => r.getId() !== rotinaId)
      );
    }

    return sucesso;
  }

  // ─────────────────────────────────────────────────────────────
  // CRUD - TAREFAS
  // ─────────────────────────────────────────────────────────────

  /**
   * Cria uma tarefa em uma rotina
   */
  criarTarefa(
    rotinaId: string,
    titulo: string,
    descricao: string,
    xp: number,
    moedas: number,
    dificuldade: EDificuldadeTarefa = EDificuldadeTarefa.MEDIA
  ): Tarefa {
    const rotina = this.obterRotina(rotinaId);
    if (!rotina) throw new Error('Rotina não encontrada');

    const tarefa = new Tarefa(titulo, descricao, xp, moedas, dificuldade);
    rotina.adicionarTarefa(tarefa);

    // Trigger reactive update
    this.rotinasSignal.update(rotinas =>
      rotinas.map(r => (r.getId() === rotinaId ? rotina : r))
    );

    console.log(`✅ Tarefa criada: ${tarefa.getTitulo()}`);
    return tarefa;
  }

  /**
   * Obtém uma tarefa específica
   */
  obterTarefa(rotinaId: string, tarefaId: string): Tarefa | undefined {
    const rotina = this.obterRotina(rotinaId);
    return rotina?.obterTarefa(tarefaId);
  }

  /**
   * Conclui uma tarefa e adiciona XP ao usuário
   */
  concluirTarefa(rotinaId: string, tarefaId: string): void {
    const usuario = this.usuarioAtualSignal();
    const tarefa = this.obterTarefa(rotinaId, tarefaId);

    if (!usuario || !tarefa) {
      throw new Error('Usuário ou tarefa não encontrados');
    }

    tarefa.concluir();
    usuario.adicionarXP(tarefa.getXPRecompensa(), `Tarefa: ${tarefa.getTitulo()}`);
    usuario.ganharMoedas(tarefa.getMoedasRecompensa());

    this.atualizarSignals();
    console.log(`🎉 Tarefa concluída e recompensas adicionadas!`);
  }

  /**
   * Inicia uma tarefa
   */
  iniciarTarefa(rotinaId: string, tarefaId: string): void {
    const tarefa = this.obterTarefa(rotinaId, tarefaId);
    if (!tarefa) throw new Error('Tarefa não encontrada');

    tarefa.iniciar();
    this.atualizarSignals();
  }

  /**
   * Deleta uma tarefa
   */
  deletarTarefa(rotinaId: string, tarefaId: string): boolean {
    const rotina = this.obterRotina(rotinaId);
    const sucesso = rotina?.removerTarefa(tarefaId) ?? false;

    if (sucesso) {
      this.atualizarSignals();
    }

    return sucesso;
  }

  // ─────────────────────────────────────────────────────────────
  // UTILITÁRIOS
  // ─────────────────────────────────────────────────────────────

  /**
   * Força atualização dos signals (caso mude estados internamente)
   */
  private atualizarSignals(): void {
    const usuario = this.usuarioAtualSignal();
    const rotinas = this.rotinasSignal();

    if (usuario && rotinas) {
      this.usuarioAtualSignal.set(usuario);
      this.rotinasSignal.set([...rotinas]);
    }
  }

  /**
   * Reseta tudo (para testes)
   */
  resetar(): void {
    this.usuarioAtualSignal.set(null);
    this.rotinasSignal.set([]);
    console.log('🔄 Repositório resetado');
  }

  /**
   * Retorna sumário de dados
   */
  obterSumario() {
    const usuario = this.usuarioAtualSignal();
    const rotinas = this.rotinasSignal();

    return {
      usuario: usuario?.toString() || 'Nenhum usuário',
      totalRotinas: rotinas.length,
      totalTarefas: this.totalTarefas(),
      tarefasCompletas: this.tarefasCompletas(),
      progressoMedio: usuario?.calcularProgressoMedio() || 0,
    };
  }
}

import { Injectable, computed, inject } from '@angular/core';
import { EFrequencia, EDificuldadeTarefa, Rotina, Tarefa } from '../models/domain';
import { HomeFacadeService } from './home-facade.service';
import { RoutineService } from './routine.service';

/**
 * Adaptador temporario para manter compatibilidade com o MVP.
 * A fonte unica de verdade agora vive em RoutineService.
 */
@Injectable({
  providedIn: 'root',
})
export class RotatinaRepository {
  private readonly homeFacade = inject(HomeFacadeService);
  private readonly routineService = inject(RoutineService);

  readonly usuarioAtual = this.homeFacade.usuarioAtual;
  readonly rotinas = computed(() => this.routineService.routinesSignal().map((routine) => routine.domainModel!).filter(Boolean));
  readonly totalRotinas = this.homeFacade.totalRotinas;
  readonly rotinasCompletas = this.homeFacade.rotinasCompletas;
  readonly totalTarefas = this.homeFacade.totalTarefas;
  readonly tarefasCompletas = this.homeFacade.tarefasCompletas;

  seedData(): void {
    this.routineService.seedData();
  }

  criarRotina(titulo: string, descricao: string, frequencia: EFrequencia): Rotina {
    const rotina = new Rotina(titulo, descricao, frequencia);
    return this.routineService.adicionarRotina(rotina).domainModel!;
  }

  obterRotina(rotinaId: string): Rotina | undefined {
    return this.routineService.getRoutineById(rotinaId)?.domainModel;
  }

  atualizarRotina(rotinaId: string, titulo: string, descricao: string): void {
    this.routineService.updateRoutine(rotinaId, { title: titulo, description: descricao });
  }

  deletarRotina(rotinaId: string): boolean {
    const rotina = this.obterRotina(rotinaId);
    if (!rotina) {
      return false;
    }

    this.routineService.deleteRoutine(rotinaId);
    return true;
  }

  criarTarefa(
    rotinaId: string,
    titulo: string,
    descricao: string,
    xp: number,
    moedas: number,
    dificuldade: EDificuldadeTarefa = EDificuldadeTarefa.MEDIA,
  ): Tarefa {
    const rotina = this.obterRotina(rotinaId);
    if (!rotina) {
      throw new Error('Rotina nao encontrada');
    }

    const tarefa = new Tarefa(titulo, descricao, xp, moedas, dificuldade);
    rotina.adicionarTarefa(tarefa);
    this.routineService.updateRoutine(rotinaId, {});
    return tarefa;
  }

  obterTarefa(rotinaId: string, tarefaId: string): Tarefa | undefined {
    return this.obterRotina(rotinaId)?.obterTarefa(tarefaId);
  }

  concluirTarefa(rotinaId: string, tarefaId: string): void {
    this.routineService.completeTask(rotinaId, tarefaId);
  }

  iniciarTarefa(rotinaId: string, tarefaId: string): void {
    const tarefa = this.obterTarefa(rotinaId, tarefaId);
    if (!tarefa) {
      throw new Error('Tarefa nao encontrada');
    }

    tarefa.iniciar();
    this.routineService.updateRoutine(rotinaId, {});
  }

  deletarTarefa(rotinaId: string, tarefaId: string): boolean {
    const tarefa = this.obterTarefa(rotinaId, tarefaId);
    if (!tarefa) {
      return false;
    }

    this.routineService.deleteTask(rotinaId, tarefaId);
    return true;
  }

  resetar(): void {
    this.routineService.resetState();
  }

  obterSumario() {
    const usuario = this.usuarioAtual();

    return {
      usuario: usuario?.toString() || 'Nenhum usuario',
      totalRotinas: this.totalRotinas(),
      totalTarefas: this.totalTarefas(),
      tarefasCompletas: this.tarefasCompletas(),
      progressoMedio: usuario?.calcularProgressoMedio() || 0,
    };
  }
}

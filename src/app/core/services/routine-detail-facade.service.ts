import { computed, Injectable, inject, signal } from '@angular/core';
import { RoutineService, type Routine } from './routine.service';

@Injectable({ providedIn: 'root' })
export class RoutineDetailFacadeService {
  private readonly routineService = inject(RoutineService);

  readonly routineId = signal<string>('');
  readonly rotinaAtual = signal<Routine | undefined>(undefined);
  readonly loading = signal<boolean>(true);

  readonly nomeUsuario = computed(() => {
    const usuario = this.routineService.currentUserSignal();
    return usuario ? usuario.getNome() : 'Usuario';
  });

  readonly nivelUsuario = this.routineService.userLevel;
  readonly moedasUsuario = this.routineService.userCoins;
  readonly isBusy = this.routineService.isMutatingSignal;
  readonly isCompletingTask = this.routineService.isCompletingTaskSignal;
  readonly isDeletingTask = this.routineService.isDeletingTaskSignal;
  readonly errorMessage = this.routineService.operationErrorSignal;

  readonly rotineName = computed(() => this.rotinaAtual()?.title ?? 'Rotina');
  readonly rotineDescription = computed(() => this.rotinaAtual()?.description ?? '');
  readonly rotineIcon = computed(() => this.rotinaAtual()?.icon ?? '📋');
  readonly frequency = computed(() => this.rotinaAtual()?.frequency ?? 'daily');
  readonly allTasks = computed(() => this.rotinaAtual()?.tasks ?? []);

  readonly tarefasIniciais = computed(() => this.allTasks().filter((task) => !task.completed).slice(0, 1));
  readonly tarefasRestante = computed(() => this.allTasks().filter((task) => !task.completed).slice(1));
  readonly totalTarefas = computed(() => this.allTasks().length);
  readonly tarefasCompletas = computed(() => this.allTasks().filter((task) => task.completed).length);
  readonly seqenciaCompletamento = computed(() => this.rotinaAtual()?.completionStreak ?? 0);
  readonly xpTotal = computed(() => this.rotinaAtual()?.totalXP ?? 0);
  readonly moedasTotal = computed(() => this.rotinaAtual()?.totalCoins ?? 0);
  readonly rotinaCompleta = computed(() => this.tarefasCompletas() === this.totalTarefas() && this.totalTarefas() > 0);

  readonly progresso = computed(() => {
    const tasks = this.allTasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  });

  loadRoutine(id: string): void {
    this.routineId.set(id);
    this.loading.set(true);
    this.rotinaAtual.set(this.routineService.getRoutineById(id));
    this.loading.set(false);
  }

  completeTask(taskId: string): void {
    if (!this.routineId()) {
      return;
    }

    this.routineService.completeTask(this.routineId(), taskId);
    this.refreshRoutine();
  }

  uncompleteTask(taskId: string): void {
    if (!this.routineId()) {
      return;
    }

    this.routineService.uncompleteTask(this.routineId(), taskId);
    this.refreshRoutine();
  }

  deleteTask(taskId: string): void {
    if (!this.routineId()) {
      return;
    }

    this.routineService.deleteTask(this.routineId(), taskId);
    this.refreshRoutine();
  }

  clearError(): void {
    this.routineService.clearOperationError();
  }

  private refreshRoutine(): void {
    this.rotinaAtual.set(this.routineService.getRoutineById(this.routineId()));
  }
}

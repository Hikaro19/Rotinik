import { computed, Injectable, inject, signal } from '@angular/core';
import { RoutineService, type Routine } from './routine.service';

@Injectable({ providedIn: 'root' })
export class RoutineDetailFacadeService {
  private readonly routineService = inject(RoutineService);

  readonly routineId = signal<string>('');
  readonly rotinaAtual = computed(() => this.routineService.getRoutineById(this.routineId()));
  readonly loading = signal<boolean>(true);

  // CORREÇÃO 1: Lê o dado do DTO puro em vez da classe de Domínio
  readonly nomeUsuario = computed(() => {
    const usuario = this.routineService.currentUserSignal();
    return usuario ? (usuario.name || usuario.userName) : 'Usuário';
  });

  readonly nivelUsuario = this.routineService.userLevel;
  readonly moedasUsuario = this.routineService.userCoins;
  readonly isBusy = this.routineService.isMutatingSignal;
  readonly isCompletingTask = this.routineService.isCompletingTaskSignal;
  readonly isUpdatingTask = this.routineService.isUpdatingTaskSignal;
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
    this.routineService.initialize();
    this.loading.set(false);
  }

  completeTask(taskId: string): void {
    if (!this.routineId()) return;
    this.routineService.completeTask(this.routineId(), taskId);
  }

  // CORREÇÃO 2: Mapeia o Partial<Routine> para o UpdateRoutineRequestDto
  updateRoutine(updates: Partial<Routine>): void {
    if (!this.routineId()) return;

    this.routineService.updateRoutine(this.routineId(), {
      title: updates.title,
      description: updates.description,
      category: updates.category,
      frequency: updates.frequency as string
    });
  }

  // O método volta a funcionar, pois a função foi adicionada ao Service
  uncompleteTask(taskId: string): void {
    if (!this.routineId()) return;
    this.routineService.uncompleteTask(this.routineId(), taskId);
  }

  deleteTask(taskId: string): void {
    if (!this.routineId()) return;
    this.routineService.deleteTask(this.routineId(), taskId);
  }

  clearError(): void {
    this.routineService.clearOperationError();
  }
}
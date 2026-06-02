import { Injectable, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs/operators';
import { RoutineViewModel, TaskViewModel } from '@features/routines/models/routine-view.models';
import { RoutineApiService } from '@features/routines/services/routine-api.service';
import { RoutineMapperService } from '@features/routines/services/routine-mapper.service';
import { getHttpErrorMessage } from '@core/http/http-error.utils';
import {
  CreateRoutineRequestDto,
  UpdateRoutineRequestDto,
  RoutineUserDto,
} from '@features/routines/models/routine-api.models';

export type Task = TaskViewModel;
export type Routine = RoutineViewModel;
type RoutineOperation =
  | 'loadSnapshot'
  | 'createRoutine'
  | 'updateRoutine'
  | 'deleteRoutine'
  | 'addTask'
  | 'updateTask'
  | 'deleteTask'
  | 'completeTask';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly routineApi = inject(RoutineApiService);
  private readonly routineMapper = inject(RoutineMapperService);

  readonly currentUserSignal = signal<RoutineUserDto | null>(null);
  readonly routinesSignal = signal<Routine[]>([]);
  readonly isLoadingSignal = signal(false);
  private readonly pendingOperationsState = signal<Record<RoutineOperation, boolean>>({
    loadSnapshot: false,
    createRoutine: false,
    updateRoutine: false,
    deleteRoutine: false,
    addTask: false,
    updateTask: false,
    deleteTask: false,
    completeTask: false,
  });
  readonly operationErrorSignal = signal<string | null>(null);

  readonly totalRoutines = computed(() => this.routinesSignal().length);
  readonly completedRoutines = computed(() => this.routinesSignal().filter((r) => r.isCompleted).length);
  readonly totalPossibleXP = computed(() => this.routinesSignal().reduce((sum, r) => sum + r.totalXP, 0));
  readonly totalPendingTasks = computed(() =>
    this.routinesSignal().reduce((sum, r) => sum + r.tasks.filter((t) => !t.completed).length, 0),
  );
  readonly longestStreak = computed(() =>
    this.routinesSignal().reduce((max, r) => Math.max(max, r.completionStreak), 0),
  );

  readonly userLevel = computed(() => this.currentUserSignal()?.level ?? 0);
  readonly userXP = computed(() => this.currentUserSignal()?.currentXp ?? 0);
  readonly userCoins = computed(() => this.currentUserSignal()?.coins ?? 0);
  readonly userLevelProgress = computed(() => this.currentUserSignal()?.levelProgress ?? 0);

  readonly isMutatingSignal = computed(() =>
    Object.entries(this.pendingOperationsState())
      .filter(([key]) => key !== 'loadSnapshot')
      .some(([, isPending]) => isPending),
  );
  readonly isCreatingRoutineSignal = computed(() => this.pendingOperationsState().createRoutine);
  readonly isCompletingTaskSignal = computed(() => this.pendingOperationsState().completeTask);
  readonly isUpdatingTaskSignal = computed(() => this.pendingOperationsState().updateTask);
  readonly isDeletingTaskSignal = computed(() => this.pendingOperationsState().deleteTask);

  private readonly isInitializedSignal = signal(false);

  readonly xpToNextLevel = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return 0;
    return Math.floor(100 * Math.pow(user.level || 1, 1.5));
  });

  initialize(): void {
    if (this.isInitializedSignal() || this.isLoadingSignal()) return;
    this.loadSnapshotFromApi();
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routinesSignal().find((r) => r.id === id);
  }

  loadSnapshotFromApi(): void {
    this.startOperation('loadSnapshot');
    this.isLoadingSignal.set(true);

    this.routineApi
      .getSnapshot()
      .pipe(take(1))
      .subscribe({
        next: (snapshot) => {
          if (snapshot.user) this.currentUserSignal.set(snapshot.user);
          this.routinesSignal.set(this.routineMapper.mapApiRoutinesToViewModels(snapshot.routines));
          this.isInitializedSignal.set(true);
          this.finishOperation('loadSnapshot');
          this.isLoadingSignal.set(false);
        },
        error: (error) => {
          this.failOperation('loadSnapshot', getHttpErrorMessage(error, 'Não foi possível carregar os dados.'));
          this.isLoadingSignal.set(false);
        },
      });
  }

  createRoutine(payload: CreateRoutineRequestDto): void {
    this.startOperation('createRoutine');
    this.routineApi
      .create(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadSnapshotFromApi();
          this.finishOperation('createRoutine');
        },
        error: (error) => this.failOperation('createRoutine', getHttpErrorMessage(error, 'Falha ao criar rotina.')),
      });
  }

  updateRoutine(routineId: string, payload: UpdateRoutineRequestDto): void {
    this.startOperation('updateRoutine');
    this.routineApi
      .update(routineId, payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadSnapshotFromApi();
          this.finishOperation('updateRoutine');
        },
        error: (error) => this.failOperation('updateRoutine', getHttpErrorMessage(error, 'Falha ao atualizar.')),
      });
  }

  deleteRoutine(routineId: string): void {
    this.startOperation('deleteRoutine');
    this.routineApi
      .delete(routineId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.routinesSignal.update((routines) => routines.filter((r) => r.id !== routineId));
          this.finishOperation('deleteRoutine');
        },
        error: (error) => this.failOperation('deleteRoutine', getHttpErrorMessage(error, 'Falha ao excluir.')),
      });
  }

  completeTask(routineId: string, taskId: string): { xp: number; coins: number } {
    this.startOperation('completeTask');

    let xpRecompensa = 0;
    let moedasRecompensa = 0;

    // 1. Optimistic Update nas Rotinas
    this.routinesSignal.update((routines) =>
      routines.map((r) => {
        if (r.id !== routineId) return r;

        const tasks = r.tasks.map((t) => {
          if (t.id === taskId) {
            xpRecompensa = t.xpReward || 0;
            moedasRecompensa = t.coinReward || 0;
            return { ...t, completed: true, completedDate: new Date() };
          }
          return t;
        });

        const isCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
        return { ...r, tasks, isCompleted };
      }),
    );

    // 2. Optimistic Update no Usuário
    if (xpRecompensa > 0 || moedasRecompensa > 0) {
      this.currentUserSignal.update((user) =>
        user
          ? {
              ...user,
              currentXp: (user.currentXp || 0) + xpRecompensa,
              coins: (user.coins || 0) + moedasRecompensa,
            }
          : user,
      );
    }

    // 3. Chamada à API
    this.routineApi
      .completeTask(routineId, taskId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadSnapshotFromApi();
          this.finishOperation('completeTask');
        },
        error: (error) => {
          this.loadSnapshotFromApi();
          this.failOperation('completeTask', getHttpErrorMessage(error, 'Falha ao completar tarefa.'));
        },
      });

    return { xp: xpRecompensa, coins: moedasRecompensa };
  }

  uncompleteTask(routineId: string, taskId: string): void {
    this.startOperation('completeTask');

    this.routinesSignal.update((routines) =>
      routines.map((r) =>
        r.id === routineId
          ? {
              ...r,
              tasks: r.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: false, completedDate: undefined } : t,
              ),
            }
          : r,
      ),
    );

    this.routineApi
      .completeTask(routineId, taskId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadSnapshotFromApi();
          this.finishOperation('completeTask');
        },
        error: (error) => {
          this.loadSnapshotFromApi();
          this.failOperation('completeTask', getHttpErrorMessage(error, 'Falha ao desmarcar tarefa.'));
        },
      });
  }

  deleteTask(routineId: string, taskId: string): void {
    this.startOperation('deleteTask');
    this.routineApi
      .deleteTask(routineId, taskId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadSnapshotFromApi();
          this.finishOperation('deleteTask');
        },
        error: (error) => this.failOperation('deleteTask', getHttpErrorMessage(error, 'Falha ao remover a tarefa.')),
      });
  }

  clearOperationError(): void {
    this.operationErrorSignal.set(null);
  }

  getAllRoutines(): Routine[] {
    return this.routinesSignal();
  }

  resetState(): void {
    this.currentUserSignal.set(null);
    this.routinesSignal.set([]);
    this.isInitializedSignal.set(false);
  }

  removeRoutineFromState(routineId: string): void {
    this.routinesSignal.update((routines) => routines.filter((r) => r.id !== routineId));
  }

  private startOperation(operation: RoutineOperation): void {
    this.operationErrorSignal.set(null);
    this.pendingOperationsState.update((state) => ({ ...state, [operation]: true }));
  }

  private finishOperation(operation: RoutineOperation): void {
    this.pendingOperationsState.update((state) => ({ ...state, [operation]: false }));
  }

  private failOperation(operation: RoutineOperation, message: string): void {
    this.operationErrorSignal.set(message);
    this.pendingOperationsState.update((state) => ({ ...state, [operation]: false }));
  }
}

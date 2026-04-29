import { Injectable, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Usuario, Rotina } from '@core/models/domain';
import {
  CreateRoutineRequestDto,
  CreateTaskRequestDto,
  RoutineDto,
  RoutinesSnapshotDto,
  UpdateRoutineRequestDto,
} from '@core/models/api';
import { RoutineViewModel, TaskViewModel } from '@core/models/view/routine-view.models';
import { createMockRoutineUser } from '@core/mocks/routine.mock';
import { getHttpErrorMessage } from '@core/http/http-error.utils';
import { RoutineApiService } from './routine-api.service';
import { RoutineMapperService } from './routine-mapper.service';

export type Task = TaskViewModel;
export type Routine = RoutineViewModel;
type RoutineOperation = 'loadSnapshot' | 'createRoutine' | 'updateRoutine' | 'deleteRoutine' | 'addTask' | 'deleteTask' | 'completeTask';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly routineApi = inject(RoutineApiService);
  private readonly routineMapper = inject(RoutineMapperService);

  private readonly currentUserState = signal<Usuario | null>(null);
  private readonly userRevision = signal(0);
  private readonly isInitializedSignal = signal(false);
  readonly currentUserSignal = computed(() => {
    this.userRevision();
    return this.currentUserState();
  });

  readonly routinesSignal = signal<Routine[]>([]);
  readonly isLoadingSignal = signal(false);
  private readonly pendingOperationsState = signal<Record<RoutineOperation, boolean>>({
    loadSnapshot: false,
    createRoutine: false,
    updateRoutine: false,
    deleteRoutine: false,
    addTask: false,
    deleteTask: false,
    completeTask: false,
  });
  readonly operationErrorSignal = signal<string | null>(null);

  readonly totalRoutines = computed(() => this.routinesSignal().length);
  readonly completedRoutines = computed(() => this.routinesSignal().filter((routine) => routine.isCompleted).length);
  readonly totalPossibleXP = computed(() => this.routinesSignal().reduce((sum, routine) => sum + routine.totalXP, 0));
  readonly totalPendingTasks = computed(() =>
    this.routinesSignal().reduce((sum, routine) => sum + routine.tasks.filter((task) => !task.completed).length, 0),
  );
  readonly longestStreak = computed(() =>
    this.routinesSignal().reduce((max, routine) => Math.max(max, routine.completionStreak), 0),
  );

  readonly userLevel = computed(() => this.currentUserSignal()?.getNivel() ?? 0);
  readonly userXP = computed(() => this.currentUserSignal()?.getExperiencia() ?? 0);
  readonly userCoins = computed(() => this.currentUserSignal()?.getMoedas() ?? 0);
  readonly userLevelProgress = computed(() => this.currentUserSignal()?.calcularProgressoNivel() ?? 0);
  readonly xpToNextLevel = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return 0;
    return Math.floor(100 * Math.pow(user.getNivel(), 1.5));
  });
  readonly isMutatingSignal = computed(() =>
    Object.entries(this.pendingOperationsState())
      .filter(([key]) => key !== 'loadSnapshot')
      .some(([, isPending]) => isPending),
  );
  readonly isCreatingRoutineSignal = computed(() => this.pendingOperationsState().createRoutine);
  readonly isCompletingTaskSignal = computed(() => this.pendingOperationsState().completeTask);
  readonly isDeletingTaskSignal = computed(() => this.pendingOperationsState().deleteTask);

  initialize(): void {
    if (this.isInitializedSignal()) {
      return;
    }

    this.isInitializedSignal.set(true);

    if (environment.enableMockData) {
      this.seedData();
      return;
    }

    this.loadSnapshotFromApi();
  }

  seedData(): void {
    if (this.currentUserSignal()) {
      return;
    }

    this.setCurrentUser(createMockRoutineUser());
    this.syncRoutinesFromCurrentUser();
  }

  resetState(): void {
    this.currentUserState.set(null);
    this.routinesSignal.set([]);
    this.isInitializedSignal.set(false);
  }

  adicionarRotina(rotina: Rotina): Routine {
    const routineViewModel = this.routineMapper.mapDomainRoutineToViewModel(rotina);

    if (!environment.enableMockData && !this.hasDomainData()) {
      this.routinesSignal.update((routines) => [routineViewModel, ...routines]);
      this.createRoutineInApi(routineViewModel);
      return routineViewModel;
    }

    if (!this.hasDomainData()) {
      this.routinesSignal.update((routines) => [routineViewModel, ...routines]);
      return routineViewModel;
    }

    const user = this.requireCurrentUser();
    user.adicionarRotina(rotina);

    this.bumpUserRevision();
    this.routinesSignal.update((routines) => [routineViewModel, ...routines]);
    return routineViewModel;
  }

  updateRoutine(id: string, updates: Partial<Routine>): void {
    const routine = this.getRoutineById(id);
    if (!routine) {
      return;
    }

    if (!environment.enableMockData && !routine.domainModel) {
      this.routinesSignal.update((routines) =>
        routines.map((item) => (item.id === id ? { ...item, ...updates, tasks: updates.tasks ?? item.tasks } : item)),
      );
      this.updateRoutineInApi(id, updates);
      return;
    }

    if (routine.domainModel && (updates.title || updates.description)) {
      routine.domainModel.atualizar(updates.title ?? routine.title, updates.description ?? routine.description);
      this.bumpUserRevision();
      this.syncRoutinesFromCurrentUser();
      return;
    }

    this.routinesSignal.update((routines) =>
      routines.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              tasks: updates.tasks ?? item.tasks,
            }
          : item,
      ),
    );
  }

  deleteRoutine(id: string): void {
    if (!environment.enableMockData && !this.hasDomainData()) {
      this.routinesSignal.update((routines) => routines.filter((routine) => routine.id !== id));
      this.deleteRoutineInApi(id);
      return;
    }

    if (this.hasDomainData()) {
      const user = this.requireCurrentUser();
      user.removerRotina(id);
      this.bumpUserRevision();
    }

    this.routinesSignal.update((routines) => routines.filter((routine) => routine.id !== id));
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routinesSignal().find((routine) => routine.id === id);
  }

  getAllRoutines(): Routine[] {
    return this.routinesSignal();
  }

  getRoutinesByFrequency(frequency: Routine['frequency']): Routine[] {
    return this.routinesSignal().filter((routine) => routine.frequency === frequency);
  }

  completeTask(routineId: string, taskId: string): { xp: number; coins: number } {
    const routine = this.getRoutineById(routineId);
    if (!routine) {
      return { xp: 0, coins: 0 };
    }

    if (!environment.enableMockData && !routine.domainModel) {
      const task = routine.tasks.find((item) => item.id === taskId);
      const reward = {
        xp: task?.xpReward ?? 0,
        coins: task?.coinReward ?? 0,
      };
      this.completeTaskInApi(routineId, taskId);
      return reward;
    }

    if (routine.domainModel) {
      return this.completeDomainTask(routineId, taskId);
    }

    let reward = { xp: 0, coins: 0 };
    this.routinesSignal.update((routines) =>
      routines.map((item) => {
        if (item.id !== routineId) {
          return item;
        }

        const tasks = item.tasks.map((task) => {
          if (task.id !== taskId || task.completed) {
            return task;
          }

          reward = { xp: task.xpReward, coins: task.coinReward };
          return {
            ...task,
            completed: true,
            completedDate: new Date(),
          };
        });

        const isCompleted = tasks.length > 0 && tasks.every((task) => task.completed);
        return {
          ...item,
          tasks,
          isCompleted,
          lastCompletedDate: isCompleted ? new Date() : item.lastCompletedDate,
          completionStreak: isCompleted ? item.completionStreak + 1 : item.completionStreak,
        };
      }),
    );

    if (reward.xp > 0 || reward.coins > 0) {
      this.applyRewardsToCurrentUser(reward.xp, reward.coins, `Tarefa: ${routine.title}`);
    }

    return reward;
  }

  uncompleteTask(routineId: string, taskId: string): void {
    const routine = this.getRoutineById(routineId);
    if (!routine) {
      return;
    }

    if (routine.domainModel) {
      const domainTask = this.requireCurrentUser().obterRotina(routineId)?.obterTarefa(taskId);
      if (!domainTask) {
        return;
      }

      domainTask.voltarParaPendente();
      this.syncRoutinesFromCurrentUser();
      return;
    }

    this.routinesSignal.update((routines) =>
      routines.map((item) =>
        item.id === routineId
          ? {
              ...item,
              isCompleted: false,
              tasks: item.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: false, completedDate: undefined } : task,
              ),
            }
          : item,
      ),
    );
  }

  addTaskToRoutine(routineId: string, taskData: Omit<Task, 'id' | 'routineId' | 'completed' | 'order'>): void {
    const routine = this.getRoutineById(routineId);
    if (!routine) {
      return;
    }

    if (!environment.enableMockData && !routine.domainModel) {
      this.addTaskInApi(routineId, taskData);
      return;
    }

    if (routine.domainModel) {
      const task = this.routineMapper.createDomainTask(taskData);

      routine.domainModel.adicionarTarefa(task);
      this.syncRoutinesFromCurrentUser();
      return;
    }

    this.routinesSignal.update((routines) =>
      routines.map((item) => {
        if (item.id !== routineId) {
          return item;
        }

        const newTask: Task = {
          id: `task-${routineId}-${Date.now()}`,
          routineId,
          title: taskData.title,
          description: taskData.description,
          completed: false,
          xpReward: taskData.xpReward,
          coinReward: taskData.coinReward,
          order: item.tasks.length + 1,
        };

        return {
          ...item,
          tasks: [...item.tasks, newTask],
          totalXP: item.totalXP + newTask.xpReward,
          totalCoins: item.totalCoins + newTask.coinReward,
        };
      }),
    );
  }

  deleteTask(routineId: string, taskId: string): void {
    const routine = this.getRoutineById(routineId);
    if (!routine) {
      return;
    }

    if (!environment.enableMockData && !routine.domainModel) {
      this.deleteTaskInApi(routineId, taskId);
      return;
    }

    if (routine.domainModel) {
      routine.domainModel.removerTarefa(taskId);
      this.syncRoutinesFromCurrentUser();
      return;
    }

    this.routinesSignal.update((routines) =>
      routines.map((item) => {
        if (item.id !== routineId) {
          return item;
        }

        const tasks = item.tasks.filter((task) => task.id !== taskId);
        return {
          ...item,
          tasks,
          totalXP: tasks.reduce((sum, task) => sum + task.xpReward, 0),
          totalCoins: tasks.reduce((sum, task) => sum + task.coinReward, 0),
          isCompleted: tasks.length > 0 && tasks.every((task) => task.completed),
        };
      }),
    );
  }

  addCoins(amount: number): void {
    const user = this.requireCurrentUser();
    user.ganharMoedas(amount);
    this.bumpUserRevision();
  }

  spendCoins(amount: number): boolean {
    const user = this.requireCurrentUser();
    const success = user.gastarMoedas(amount);

    if (success) {
      this.bumpUserRevision();
    }

    return success;
  }

  hydrateFromApi(snapshot: RoutinesSnapshotDto): void {
    this.setCurrentUser(this.routineMapper.createUserFromApiSnapshot(snapshot));
    this.setRoutines(this.routineMapper.mapSnapshotFromApi(snapshot));
  }

  mapSnapshotFromApi(snapshot: RoutinesSnapshotDto): Routine[] {
    return this.routineMapper.mapSnapshotFromApi(snapshot);
  }

  clearOperationError(): void {
    this.operationErrorSignal.set(null);
  }

  private loadSnapshotFromApi(): void {
    this.startOperation('loadSnapshot');
    this.isLoadingSignal.set(true);
    this.routineApi
      .getSnapshot()
      .pipe(take(1))
      .subscribe({
        next: (snapshot) => {
          this.hydrateFromApi(snapshot);
          this.finishOperation('loadSnapshot');
          this.isLoadingSignal.set(false);
        },
        error: (error) => {
          this.failOperation('loadSnapshot', getHttpErrorMessage(error, 'Nao foi possivel carregar as rotinas do servidor.'));
          this.isLoadingSignal.set(false);
          this.seedData();
        },
      });
  }

  private createRoutineInApi(routine: Routine): void {
    this.startOperation('createRoutine');
    const payload: CreateRoutineRequestDto = {
      title: routine.title,
      description: routine.description,
      category: routine.category ?? 'geral',
      frequency: routine.frequency,
    };

    this.routineApi
      .create(payload)
      .pipe(take(1))
      .subscribe({
        next: (createdRoutine) => {
          this.replaceRoutineFromApi(routine.id, createdRoutine);
          this.finishOperation('createRoutine');
        },
        error: (error) =>
          this.failOperation('createRoutine', getHttpErrorMessage(error, 'Nao foi possivel criar a rotina agora.')),
      });
  }

  private updateRoutineInApi(routineId: string, updates: Partial<Routine>): void {
    this.startOperation('updateRoutine');
    const payload: UpdateRoutineRequestDto = {};

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.frequency !== undefined) payload.frequency = updates.frequency;

    this.routineApi
      .update(routineId, payload)
      .pipe(take(1))
      .subscribe({
        next: (updatedRoutine) => {
          this.replaceRoutineFromApi(routineId, updatedRoutine);
          this.finishOperation('updateRoutine');
        },
        error: (error) =>
          this.failOperation('updateRoutine', getHttpErrorMessage(error, 'Nao foi possivel atualizar a rotina.')),
      });
  }

  private deleteRoutineInApi(routineId: string): void {
    this.startOperation('deleteRoutine');
    this.routineApi
      .delete(routineId)
      .pipe(take(1))
      .subscribe({
        next: () => this.finishOperation('deleteRoutine'),
        error: (error) =>
          this.failOperation('deleteRoutine', getHttpErrorMessage(error, 'Nao foi possivel remover a rotina.')),
      });
  }

  private addTaskInApi(routineId: string, taskData: Omit<Task, 'id' | 'routineId' | 'completed' | 'order'>): void {
    this.startOperation('addTask');
    const payload: CreateTaskRequestDto = {
      title: taskData.title,
      description: taskData.description,
      xpReward: taskData.xpReward,
      coinReward: taskData.coinReward,
    };

    this.routineApi
      .addTask(routineId, payload)
      .pipe(take(1))
      .subscribe({
        next: (updatedRoutine) => {
          this.replaceRoutineFromApi(routineId, updatedRoutine);
          this.finishOperation('addTask');
        },
        error: (error) =>
          this.failOperation('addTask', getHttpErrorMessage(error, 'Nao foi possivel adicionar a tarefa.')),
      });
  }

  private deleteTaskInApi(routineId: string, taskId: string): void {
    this.startOperation('deleteTask');
    this.routineApi
      .deleteTask(routineId, taskId)
      .pipe(take(1))
      .subscribe({
        next: (updatedRoutine) => {
          this.replaceRoutineFromApi(routineId, updatedRoutine);
          this.finishOperation('deleteTask');
        },
        error: (error) =>
          this.failOperation('deleteTask', getHttpErrorMessage(error, 'Nao foi possivel remover a tarefa.')),
      });
  }

  private completeTaskInApi(routineId: string, taskId: string): void {
    this.startOperation('completeTask');
    this.routineApi
      .completeTask(routineId, taskId)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.hydrateUserFromApiReward(response.user);
          this.replaceRoutineFromApi(routineId, response.routine);
          this.finishOperation('completeTask');
        },
        error: (error) =>
          this.failOperation('completeTask', getHttpErrorMessage(error, 'Nao foi possivel concluir a tarefa.')),
      });
  }

  private completeDomainTask(routineId: string, taskId: string): { xp: number; coins: number } {
    const user = this.requireCurrentUser();
    const routine = user.obterRotina(routineId);
    const task = routine?.obterTarefa(taskId);

    if (!routine || !task || task.ehCompleta()) {
      return { xp: 0, coins: 0 };
    }

    task.concluir();
    user.adicionarXP(task.getXPRecompensa(), `Tarefa: ${task.getTitulo()}`);
    user.ganharMoedas(task.getMoedasRecompensa());

    if (routine.getTarefas().length > 0 && routine.getTarefas().every((item) => item.ehCompleta())) {
      try {
        routine.marcarCompleta();
      } catch {
        // noop
      }
    }

    this.bumpUserRevision();
    this.syncRoutinesFromCurrentUser();

    return {
      xp: task.getXPRecompensa(),
      coins: task.getMoedasRecompensa(),
    };
  }

  private applyRewardsToCurrentUser(xp: number, coins: number, reason: string): void {
    const user = this.currentUserState();
    if (!user) {
      return;
    }

    if (xp > 0) {
      user.adicionarXP(xp, reason);
    }

    if (coins > 0) {
      user.ganharMoedas(coins);
    }

    this.bumpUserRevision();
  }

  private syncRoutinesFromCurrentUser(): void {
    const user = this.currentUserState();
    if (!user) {
      this.setRoutines([]);
      return;
    }

    this.bumpUserRevision();
    this.setRoutines(user.getRotinas().map((routine) => this.routineMapper.mapDomainRoutineToViewModel(routine)));
  }

  private requireCurrentUser(): Usuario {
    const user = this.currentUserState();
    if (!user) {
      throw new Error('Usuario nao inicializado');
    }
    return user;
  }

  private hasDomainData(): boolean {
    return this.routinesSignal().some((routine) => !!routine.domainModel);
  }

  private setCurrentUser(user: Usuario | null): void {
    this.currentUserState.set(user);
    this.bumpUserRevision();
  }

  private setRoutines(routines: Routine[]): void {
    this.routinesSignal.set(routines);
  }

  private replaceRoutineFromApi(routineId: string, routine: RoutineDto): void {
    const mappedRoutine = this.routineMapper.mapApiRoutineToViewModel(routine);
    this.routinesSignal.update((routines) => {
      const hasExisting = routines.some((item) => item.id === routineId);
      if (!hasExisting) {
        return [mappedRoutine, ...routines];
      }

      return routines.map((item) => (item.id === routineId ? mappedRoutine : item));
    });
  }

  private hydrateUserFromApiReward(user: RoutinesSnapshotDto['user']): void {
    const snapshot: RoutinesSnapshotDto = {
      user,
      routines: this.routinesSignal().map((routine) => ({
        id: routine.id,
        title: routine.title,
        description: routine.description,
        category: routine.category ?? 'geral',
        icon: routine.icon,
        color: routine.color,
        frequency: routine.frequency,
        tasks: routine.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          isCompleted: task.completed,
          xpReward: task.xpReward,
          coinReward: task.coinReward,
          order: task.order,
          completedAt: task.completedDate?.toISOString(),
        })),
        totalXp: routine.totalXP,
        totalCoins: routine.totalCoins,
        createdAt: routine.createdDate.toISOString(),
        completionStreak: routine.completionStreak,
        lastCompletedAt: routine.lastCompletedDate?.toISOString(),
        isCompleted: routine.isCompleted,
      })),
    };

    this.setCurrentUser(this.routineMapper.createUserFromApiSnapshot(snapshot));
  }

  private bumpUserRevision(): void {
    this.userRevision.update((revision) => revision + 1);
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

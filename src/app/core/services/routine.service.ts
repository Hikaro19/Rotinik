import { Injectable, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Usuario, Rotina } from '@core/models/domain';
import { RoutinesSnapshotDto } from '@core/models/api';
import { RoutineViewModel, TaskViewModel } from '@core/models/view/routine-view.models';
import { createMockRoutineUser } from '@core/mocks/routine.mock';
import { RoutineApiService } from './routine-api.service';
import { RoutineMapperService } from './routine-mapper.service';

export type Task = TaskViewModel;
export type Routine = RoutineViewModel;

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

    this.currentUserState.set(createMockRoutineUser());
    this.touchUserState();
    this.syncRoutinesFromUser();
  }

  resetState(): void {
    this.currentUserState.set(null);
    this.routinesSignal.set([]);
    this.isInitializedSignal.set(false);
  }

  adicionarRotina(rotina: Rotina): Routine {
    if (!this.hasDomainData()) {
      const routineViewModel = this.routineMapper.mapDomainRoutineToViewModel(rotina);
      this.routinesSignal.update((routines) => [routineViewModel, ...routines]);
      return routineViewModel;
    }

    const user = this.requireCurrentUser();
    user.adicionarRotina(rotina);
    const routineViewModel = this.routineMapper.mapDomainRoutineToViewModel(rotina);

    this.touchUserState();
    this.routinesSignal.update((routines) => [routineViewModel, ...routines]);
    return routineViewModel;
  }

  updateRoutine(id: string, updates: Partial<Routine>): void {
    const routine = this.getRoutineById(id);
    if (!routine) {
      return;
    }

    if (routine.domainModel && (updates.title || updates.description)) {
      routine.domainModel.atualizar(updates.title ?? routine.title, updates.description ?? routine.description);
      this.touchUserState();
      this.syncRoutinesFromUser();
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
    if (this.hasDomainData()) {
      const user = this.requireCurrentUser();
      user.removerRotina(id);
      this.touchUserState();
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
      this.syncRoutinesFromUser();
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

    if (routine.domainModel) {
      const task = this.routineMapper.createDomainTask(taskData);

      routine.domainModel.adicionarTarefa(task);
      this.syncRoutinesFromUser();
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

    if (routine.domainModel) {
      routine.domainModel.removerTarefa(taskId);
      this.syncRoutinesFromUser();
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
    this.touchUserState();
  }

  spendCoins(amount: number): boolean {
    const user = this.requireCurrentUser();
    const success = user.gastarMoedas(amount);

    if (success) {
      this.touchUserState();
    }

    return success;
  }

  hydrateFromApi(snapshot: RoutinesSnapshotDto): void {
    this.currentUserState.set(this.routineMapper.createUserFromApiSnapshot(snapshot));
    this.touchUserState();
    this.routinesSignal.set(this.routineMapper.mapSnapshotFromApi(snapshot));
  }

  mapSnapshotFromApi(snapshot: RoutinesSnapshotDto): Routine[] {
    return this.routineMapper.mapSnapshotFromApi(snapshot);
  }

  private loadSnapshotFromApi(): void {
    this.isLoadingSignal.set(true);
    this.routineApi
      .getSnapshot()
      .pipe(take(1))
      .subscribe({
        next: (snapshot) => {
          this.hydrateFromApi(snapshot);
          this.isLoadingSignal.set(false);
        },
        error: () => {
          this.isLoadingSignal.set(false);
          this.seedData();
        },
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

    this.touchUserState();
    this.syncRoutinesFromUser();

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

    this.touchUserState();
  }

  private syncRoutinesFromUser(): void {
    const user = this.currentUserState();
    if (!user) {
      this.routinesSignal.set([]);
      return;
    }

    this.touchUserState();
    this.routinesSignal.set(user.getRotinas().map((routine) => this.routineMapper.mapDomainRoutineToViewModel(routine)));
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

  private touchUserState(): void {
    this.userRevision.update((revision) => revision + 1);
  }

}

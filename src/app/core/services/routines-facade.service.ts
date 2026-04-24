import { computed, Injectable, inject, signal } from '@angular/core';
import { type Routine, RoutineService } from './routine.service';
import { Rotina } from '@core/models/domain';

@Injectable({ providedIn: 'root' })
export class RoutinesFacadeService {
  private readonly routineService = inject(RoutineService);

  readonly routines = this.routineService.routinesSignal;
  readonly totalRoutines = this.routineService.totalRoutines;
  readonly completedRoutines = this.routineService.completedRoutines;
  readonly totalPossibleXP = this.routineService.totalPossibleXP;
  readonly totalPendingTasks = this.routineService.totalPendingTasks;
  readonly isBusy = this.routineService.isMutatingSignal;
  readonly createPending = this.routineService.isCreatingRoutineSignal;
  readonly errorMessage = this.routineService.operationErrorSignal;
  readonly activeFilter = signal<'all' | Routine['frequency']>('all');

  readonly filteredRoutines = computed(() => {
    const filter = this.activeFilter();
    const routines = this.routines();
    const visibleRoutines = filter === 'all'
      ? routines
      : routines.filter((routine) => routine.frequency === filter);

    return visibleRoutines
      .filter((routine) => !routine.isCompleted && routine.tasks.length > 0)
      .sort((a, b) => {
        const progressA = a.tasks.length > 0 ? a.tasks.filter((task) => task.completed).length / a.tasks.length : 0;
        const progressB = b.tasks.length > 0 ? b.tasks.filter((task) => task.completed).length / b.tasks.length : 0;
        return progressB - progressA;
      });
  });

  setFilter(filter: 'all' | Routine['frequency']): void {
    this.activeFilter.set(filter);
  }

  clearError(): void {
    this.routineService.clearOperationError();
  }

  createRoutine(rotina: Rotina): void {
    this.routineService.adicionarRotina(rotina);
  }
}

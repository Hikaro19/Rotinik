import { computed, Injectable, inject, signal } from '@angular/core';
import { Routine, RoutineService } from './routine.service';
import { CreateRoutineRequestDto } from '../models/routine-api.models';

@Injectable({ providedIn: 'root' })
export class RoutinesFacadeService {
  private readonly routineService = inject(RoutineService);

  constructor() {
    this.routineService.initialize();
  }

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

    const visibleRoutines = filter === 'all' ? routines : routines.filter(r => {
      if (!r.frequency) return false;
      return String(r.frequency).toLowerCase() === String(filter).toLowerCase();
    });

    return visibleRoutines
      .filter((routine) => !routine.isCompleted || (routine.tasks && routine.tasks.length === 0))
      .sort((a, b) => {
        const totalA = a.tasks?.length ?? 0;
        const totalB = b.tasks?.length ?? 0;
        if (totalA === 0 && totalB === 0) return 0;
        if (totalA === 0) return 1;
        if (totalB === 0) return -1;
        return (b.tasks.filter(t => t.completed).length / totalB) - (a.tasks.filter(t => t.completed).length / totalA);
      });
  });

  setFilter(filter: 'all' | Routine['frequency']): void {
    this.activeFilter.set(filter);
  }

  clearError(): void {
    this.routineService.clearOperationError();
  }

  // Refatorado para enviar DTO diretamente
  createRoutine(payload: CreateRoutineRequestDto): void {
    this.routineService.createRoutine(payload);
  }
}
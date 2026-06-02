import { computed, Injectable, inject, signal } from '@angular/core';
import { type Routine, RoutineService } from './routine.service';
import { Rotina } from '../models/rotina';

@Injectable({ providedIn: 'root' })
export class RoutinesFacadeService {
  private readonly routineService = inject(RoutineService);

  // Inicializa o serviço caso a rota for acessada via URL / F5
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

    const visibleRoutines = filter === 'all'
      ? routines
      : routines.filter((routine) => {
        if (!routine.frequency) return false;

        const freqLower = routine.frequency.toString().toLowerCase();
        const filterStr = String(filter).toLowerCase();

        if (filterStr === 'daily') {
          return freqLower === 'daily' || freqLower === 'diaria' || freqLower === '0';
        }
        if (filterStr === 'weekly') {
          return freqLower === 'weekly' || freqLower === 'semanal' || freqLower === '1';
        }
        if (filterStr === 'monthly') {
          return freqLower === 'monthly' || freqLower === 'mensal' || freqLower === '2';
        }

        return freqLower === filterStr;
      });

    return visibleRoutines
      .filter((routine) => !routine.isCompleted || (routine.tasks && routine.tasks.length === 0))
      .sort((a, b) => {
        const totalA = a.tasks?.length ?? 0;
        const totalB = b.tasks?.length ?? 0;

        if (totalA === 0 && totalB === 0) return 0;
        if (totalA === 0) return 1;
        if (totalB === 0) return -1;

        const progressA = a.tasks.filter((task) => task.completed).length / totalA;
        const progressB = b.tasks.filter((task) => task.completed).length / totalB;
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
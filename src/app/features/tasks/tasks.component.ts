import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService, Routine } from '@core/services/routine.service';
import { AppTaskExecutionComponent } from '@shared/components/feature/task-execution/task-execution.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';

/**
 * TasksComponent: Página principal de execução de tarefas
 * Gerencia o fluxo de execução passo-a-passo com rewards
 */
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, AppTaskExecutionComponent, AppSpinnerComponent],
  template: `
    <div class="tasks-page">
      <div *ngIf="routine; else loading">
        <app-task-execution [routine]="routine" [onCloseCallback]="goBackToRoutines">
        </app-task-execution>
      </div>

      <ng-template #loading>
        <div class="tasks-page__loading">
          <app-spinner size="lg" [showText]="true" text="Carregando rotina..."></app-spinner>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .tasks-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-primary);
        padding: 16px;
      }

      .tasks-page__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
      }
    `,
  ],
})
export class TasksComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routineService = inject(RoutineService);

  routine: Routine | undefined;

  ngOnInit(): void {
    // Get routineId from route params
    const routineId = this.route.snapshot.paramMap.get('id');

    if (routineId) {
      this.routine = this.routineService.getRoutineById(routineId);
    } else {
      // Fallback to first routine
      const routines = this.routineService.getAllRoutines();
      this.routine = routines[0];
    }
  }

  goBackToRoutines = (): void => {
    this.router.navigate(['/routines']);
  };
}

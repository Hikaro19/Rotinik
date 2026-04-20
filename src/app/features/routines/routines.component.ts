import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rotina } from '@core/models/domain';
import { GamificationService } from '@core/services/gamification.service';
import { RoutineService, type Routine } from '@core/services/routine.service';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';
import { RoutineCreateComponent } from './routine-create.component';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    AppSpinnerComponent,
    AppToastComponent,
    RoutineCreateComponent,
  ],
  template: `
    <div class="routines-container">
      <div class="routines-header">
        <div class="routines-header-content">
          <h1 class="routines-title">Minhas Rotinas</h1>
          <p class="routines-subtitle">
            Crie e acompanhe suas rotinas diarias para ganhar XP e moedas
          </p>
        </div>

        <div class="routines-actions">
          <app-button variant="primary" size="lg" (buttonClick)="onCreateRoutine()">
            + Nova Rotina
          </app-button>
        </div>
      </div>

      <div class="routines-stats">
        <app-card variant="outlined" padding="md" rounded="md" role="region" aria-label="Estatisticas">
          <div class="routines-stats-content">
            <div class="stat-item">
              <span class="stat-label">Total de Rotinas</span>
              <span class="stat-value">{{ routineService.totalRoutines() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completas Hoje</span>
              <span class="stat-value">{{ routineService.completedRoutines() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">XP Disponivel</span>
              <span class="stat-value">{{ routineService.totalPossibleXP() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tarefas Pendentes</span>
              <span class="stat-value">{{ routineService.totalPendingTasks() }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="time-filter-container">
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="activeFilter() === 'all'"
          (click)="setFilter('all')"
        >
          Todos
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="activeFilter() === 'daily'"
          (click)="setFilter('daily')"
        >
          Diarios
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="activeFilter() === 'weekly'"
          (click)="setFilter('weekly')"
        >
          Semanais
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="activeFilter() === 'monthly'"
          (click)="setFilter('monthly')"
        >
          Mensais
        </button>
      </div>

      @if (filteredRoutines().length > 0) {
        <div class="in-progress-section">
          <h2 class="section-title">Em Andamento</h2>

          <div class="routine-cards">
            @for (rotina of filteredRoutines(); track rotina.id) {
              <div
                class="routine-card"
                (click)="goToRoutineDetail(rotina.id)"
              >
                <div class="card-left">
                  <h3 class="routine-title">{{ rotina.icon }} {{ rotina.titulo }}</h3>
                  <p class="routine-subtitle">
                    {{ rotina.tarefasCompletas }} de {{ rotina.totalTarefas }} tarefas concluidas
                  </p>
                </div>

                <div class="card-right">
                  <span class="xp-badge">+{{ rotina.xpTotal }} XP</span>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
      <div class="routines-empty">
        <app-card variant="outlined" padding="lg" rounded="md" class="empty-card">
          <div class="empty-state">
            <div class="empty-icon">+</div>
            <h2>Nenhuma rotina encontrada</h2>
            <p>
              {{ activeFilter() === 'all' ? 'Crie sua primeira rotina para comecar.' : 'Nao ha rotinas deste tipo.' }}
            </p>
            <app-button *ngIf="activeFilter() === 'all'" variant="primary" size="md" (buttonClick)="onCreateRoutine()">
              Criar Primeira Rotina
            </app-button>
          </div>
        </app-card>
      </div>
      }

      <div class="routines-toast-layer" *ngIf="successToastMessage() as message">
        <app-toast
          type="success"
          title="Rotina salva"
          [message]="message"
          [duration]="3200"
          (close)="closeSuccessToast()"
        ></app-toast>
      </div>

      <app-routine-create
        *ngIf="showCreateModal()"
        (routineCreated)="onRoutineCreated($event)"
        (cancelled)="onCancelCreate()"
      ></app-routine-create>
    </div>
  `,
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent {
  private router = inject(Router);
  readonly routineService = inject(RoutineService);
  readonly gamificationService = inject(GamificationService);

  readonly showCreateModal = signal(false);
  readonly successToastMessage = signal<string | null>(null);
  readonly routines = this.routineService.routinesSignal;
  readonly activeFilter = signal<'all' | Routine['frequency']>('all');

  readonly filteredRoutines = computed(() => {
    const filter = this.activeFilter();
    const routines = this.routines();
    const visibleRoutines = filter === 'all'
      ? routines
      : routines.filter((routine) => routine.frequency === filter);

    return visibleRoutines
      .filter((routine) => !routine.isCompleted && routine.tasks.length > 0)
      .map((routine) => ({
        id: routine.id,
        titulo: routine.title,
        icon: routine.icon,
        totalTarefas: routine.tasks.length,
        tarefasCompletas: routine.tasks.filter((task) => task.completed).length,
        xpTotal: routine.totalXP,
        frequency: routine.frequency,
      }))
      .sort((a, b) => {
        const progressA = a.totalTarefas > 0 ? a.tarefasCompletas / a.totalTarefas : 0;
        const progressB = b.totalTarefas > 0 ? b.tarefasCompletas / b.totalTarefas : 0;
        return progressB - progressA;
      });
  });

  setFilter(filter: 'all' | 'daily' | 'weekly' | 'monthly'): void {
    this.activeFilter.set(filter);
  }

  onCreateRoutine(): void {
    this.showCreateModal.set(true);
  }

  onRoutineCreated(rotina: Rotina): void {
    this.showCreateModal.set(false);
    this.successToastMessage.set(`"${rotina.getTitulo()}" entrou na sua colecao de rotinas.`);
  }

  onCancelCreate(): void {
    this.showCreateModal.set(false);
  }

  closeSuccessToast(): void {
    this.successToastMessage.set(null);
  }

  goToRoutineDetail(id: string | number): void {
    this.router.navigate(['/routine', id]);
  }
}

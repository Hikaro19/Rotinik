import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rotina } from '@core/models/domain';
import { RoutinesFacadeService } from '@core/services/routines-facade.service';
import { AppRoutineCardComponent } from '@shared/components/feature/routine-card/routine-card.component';
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
    AppRoutineCardComponent,
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
          <p class="routines-subtitle">Crie e acompanhe suas rotinas diarias para ganhar XP e moedas</p>
        </div>

        <div class="routines-actions">
          <app-button variant="primary" size="lg" [disabled]="isBusy()" (buttonClick)="onCreateRoutine()">
            + Nova Rotina
          </app-button>
        </div>
      </div>

      <div class="routines-stats">
        <app-card variant="outlined" padding="md" rounded="md" role="region" aria-label="Estatisticas">
          <div class="routines-stats-content">
            <div class="stat-item">
              <span class="stat-label">Total de Rotinas</span>
              <span class="stat-value">{{ routinesFacade.totalRoutines() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completas Hoje</span>
              <span class="stat-value">{{ routinesFacade.completedRoutines() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">XP Disponivel</span>
              <span class="stat-value">{{ routinesFacade.totalPossibleXP() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tarefas Pendentes</span>
              <span class="stat-value">{{ routinesFacade.totalPendingTasks() }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="routines-toast-layer" *ngIf="errorMessage() as message">
        <app-toast
          type="error"
          title="Falha na sincronizacao"
          [message]="message"
          [duration]="5000"
          (close)="clearError()"
        ></app-toast>
      </div>

      <div class="time-filter-container">
        <button type="button" class="time-filter-btn" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">
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
              <app-routine-card
                [routine]="rotina"
                (start)="goToRoutineDetail($event)"
                (edit)="goToRoutineDetail($event)"
              ></app-routine-card>
            }
          </div>
        </div>
      } @else {
        <div class="routines-empty">
          <app-card variant="outlined" padding="lg" rounded="md" class="empty-card">
            <div class="empty-state">
              <div class="empty-icon">+</div>
              <h2>Nenhuma rotina encontrada</h2>
              <p>{{ activeFilter() === 'all' ? 'Crie sua primeira rotina para comecar.' : 'Nao ha rotinas deste tipo.' }}</p>
              <app-button *ngIf="activeFilter() === 'all'" variant="primary" size="md" [disabled]="isBusy()" (buttonClick)="onCreateRoutine()">
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
  readonly routinesFacade = inject(RoutinesFacadeService);

  readonly showCreateModal = signal(false);
  readonly successToastMessage = signal<string | null>(null);
  readonly activeFilter = this.routinesFacade.activeFilter;
  readonly filteredRoutines = this.routinesFacade.filteredRoutines;
  readonly isBusy = this.routinesFacade.isBusy;
  readonly errorMessage = this.routinesFacade.errorMessage;

  setFilter(filter: 'all' | 'daily' | 'weekly' | 'monthly'): void {
    this.routinesFacade.setFilter(filter);
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

  clearError(): void {
    this.routinesFacade.clearError();
  }

  goToRoutineDetail(id: string | number): void {
    this.router.navigate(['/routine', id]);
  }
}

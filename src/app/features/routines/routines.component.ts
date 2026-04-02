import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoutineService, Routine } from '@core/services/routine.service';
import { GamificationService } from '@core/services/gamification.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';
import { AppRoutineCardComponent } from '@shared/components/feature/routine-card/routine-card.component';
import { RoutineCreateComponent } from './routine-create.component';

/**
 * RoutinesComponent: Página principal de rotinas
 * Exibe lista de rotinas do usuário com CRUD básico
 */
@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    AppSpinnerComponent,
    AppRoutineCardComponent,
    RoutineCreateComponent,
  ],
  template: `
    <div class="routines-container">
      <!-- Header -->
      <div class="routines-header">
        <div class="routines-header-content">
          <h1 class="routines-title">Minhas Rotinas 📋</h1>
          <p class="routines-subtitle">
            Crie e acompanhe suas rotinas diárias para ganhar XP e moedas
          </p>
        </div>

        <div class="routines-actions">
          <app-button variant="primary" size="lg" (buttonClick)="onCreateRoutine()">
            ➕ Nova Rotina
          </app-button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="routines-stats">
        <app-card variant="outlined" padding="md" rounded="md" role="region" aria-label="Estatísticas">
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
              <span class="stat-label">XP Disponível</span>
              <span class="stat-value">{{ routineService.totalPossibleXP() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tarefas Pendentes</span>
              <span class="stat-value">{{ routineService.totalPendingTasks() }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filter/Sort -->
      <div class="time-filter-container">
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="currentFilter === 'all'"
          (click)="setFilter('all')"
        >
          Todos
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="currentFilter === 'daily'"
          (click)="setFilter('daily')"
        >
          Diários
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="currentFilter === 'weekly'"
          (click)="setFilter('weekly')"
        >
          Semanais
        </button>
        <button
          type="button"
          class="time-filter-btn"
          [class.active]="currentFilter === 'monthly'"
          (click)="setFilter('monthly')"
        >
          Mensais
        </button>
      </div>

      <!-- Routines Grid -->
      <div *ngIf="filteredRoutines().length > 0" class="routines-grid">
        <app-routine-card
          *ngFor="let routine of filteredRoutines()"
          [routine]="routine"
          (edit)="onEditRoutine($event)"
          (start)="onStartRoutine($event)"
        ></app-routine-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredRoutines().length === 0" class="routines-empty">
        <app-card variant="outlined" padding="lg" rounded="md" class="empty-card">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h2>Nenhuma rotina encontrada</h2>
            <p>
              {{ currentFilter === 'all'
                ? 'Crie sua primeira rotina para começar!'
                : 'Não há rotinas deste tipo' }}
            </p>
            <app-button
              *ngIf="currentFilter === 'all'"
              variant="primary"
              size="md"
              (buttonClick)="onCreateRoutine()"
            >
              Criar Primeira Rotina
            </app-button>
          </div>
        </app-card>
      </div>

      <!-- Modal de Criação -->
      <app-routine-create
        *ngIf="showCreateModal()"
        (routineCreated)="onRoutineCreated($event)"
        (cancelled)="onCancelCreate()"
      ></app-routine-create>
    </div>
  `,
  styleUrl: './routines.component.scss',
})
export class RoutinesComponent implements OnInit {
  private router = inject(Router);
  routineService = inject(RoutineService);
  gamificationService = inject(GamificationService);

  // Signals
  showCreateModal = signal(false);

  // Filter
  currentFilter: 'all' | 'daily' | 'weekly' | 'monthly' = 'all';

  ngOnInit(): void {
    console.log('✅ RoutinesComponent carregado');
  }

  filteredRoutines() {
    if (this.currentFilter === 'all') {
      return this.routineService.getAllRoutines();
    }
    return this.routineService.getRoutinesByFrequency(this.currentFilter);
  }

  setFilter(filter: 'all' | 'daily' | 'weekly' | 'monthly'): void {
    this.currentFilter = filter;
  }

  onCreateRoutine(): void {
    this.showCreateModal.set(true);
  }

  onRoutineCreated(rotina: any): void {
    console.log('✅ Rotina criada com sucesso:', rotina);
    this.showCreateModal.set(false);
    // A lista será atualizada automaticamente através dos signals do service
  }

  onCancelCreate(): void {
    this.showCreateModal.set(false);
  }

  onEditRoutine(routineId: string): void {
    console.log('Editar rotina:', routineId);
    // TODO: Implementar navigação
    // this.router.navigate(['/routines', routineId, 'edit']);
  }

  onStartRoutine(routineId: string): void {
    this.router.navigate(['/tasks', routineId]);
  }
}

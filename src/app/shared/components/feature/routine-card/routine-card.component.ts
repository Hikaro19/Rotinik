import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Routine } from '@core/services/routine.service';
import { AppButtonComponent } from '../../ui/button/button.component';
import { AppCardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-routine-card',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppButtonComponent],
  template: `
    <app-card
      class="routine-card"
      variant="default"
      padding="md"
      rounded="md"
      [clickable]="true"
      role="article"
      [attr.aria-label]="routine.title"
    >
      <div class="routine-card__content">
        <div class="routine-card__main-row">
          <div class="routine-card__body">
            <div class="routine-card__topline">
              <span class="routine-card__icon">{{ routine.icon }}</span>
              <span class="routine-card__frequency-badge">{{ frequencyLabel() }}</span>
            </div>

            <h3 class="routine-card__title">{{ routine.title }}</h3>

            <div
              class="progress-segments"
              [attr.aria-label]="completedTaskCount() + ' de ' + routine.tasks.length + ' tarefas concluídas'"
            >
              @for (segment of getTaskSegments(); track $index) {
                <div class="segment" [class.completed]="segment"></div>
              }
            </div>
          </div>

          <div class="routine-card__xp-badge">+{{ routine.totalXP }} XP</div>
        </div>

        <p *ngIf="routine.description" class="routine-card__description">
          {{ routine.description }}
        </p>

        <div class="routine-card__tasks-list" *ngIf="routine.tasks?.length">
          <div class="routine-card__task-item" *ngFor="let task of routine.tasks" (click)="$event.stopPropagation()">
            <label class="task-checkbox-wrapper">
              <input type="checkbox" [checked]="task.completed" (change)="onToggleTask(task, $event)">
              <span class="checkmark">
                <svg *ngIf="task.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
            </label>
            <div class="task-info">
              <span class="task-title" [class.completed]="task.completed">{{ task.title }}</span>
            </div>
            <span class="task-reward" *ngIf="task.xpReward">+{{ task.xpReward }} XP</span>
          </div>
        </div>

        <div class="routine-card__stats" *ngIf="showActions && (routine.totalCoins || routine.completionStreak > 0)">
          <div class="routine-card__stat" *ngIf="routine.totalCoins">
            <span class="routine-card__stat-icon">💰</span>
            <span class="routine-card__stat-value">{{ routine.totalCoins }} moedas</span>
          </div>
          <div class="routine-card__stat routine-card__stat--streak" *ngIf="routine.completionStreak > 0">
            <span class="routine-card__stat-icon">🔥</span>
            <span class="routine-card__stat-value">{{ routine.completionStreak }} dias</span>
          </div>
        </div>
      </div>

      <div *ngIf="showActions" appCardFooter class="routine-card__footer">
        <app-button
          variant="ghost"
          size="sm"
          (buttonClick)="onEdit()"
          [attr.aria-label]="'Editar rotina ' + routine.title"
        >
          Editar
        </app-button>
        <app-button
          variant="primary"
          size="sm"
          (buttonClick)="onStart()"
          [attr.aria-label]="'Iniciar rotina ' + routine.title"
        >
          Iniciar
        </app-button>
      </div>
    </app-card>
  `,
  styleUrl: './routine-card.component.scss',
})
export class AppRoutineCardComponent {
  @Input() routine!: Routine;
  @Input() showActions = true;
  @Output() edit = new EventEmitter<string>();
  @Output() start = new EventEmitter<string>();
  @Output() toggleTask = new EventEmitter<{ routineId: string, taskId: string, completed: boolean }>();

  frequencyLabel = () => {
    if (!this.routine?.frequency) return 'Geral';

    const freqStr = this.routine.frequency.toString().toLowerCase();

    const labels: Record<string, string> = {
      daily: 'Diariamente',
      diaria: 'Diariamente',
      '0': 'Diariamente',

      weekly: 'Semanalmente',
      semanal: 'Semanalmente',
      '1': 'Semanalmente',

      monthly: 'Mensalmente',
      mensal: 'Mensalmente',
      '2': 'Mensalmente',
    };

    return labels[freqStr] || 'Geral';
  };

  completedTaskCount = () => this.routine.tasks.filter((task) => task.completed).length;

  getTaskSegments = (): boolean[] => {
    const totalTasks = this.routine?.tasks.length ?? 0;
    const completedTasks = this.completedTaskCount();
    return Array.from({ length: totalTasks }, (_, index) => index < completedTasks);
  };

  onEdit(): void {
    this.edit.emit(this.routine.id);
  }

  onStart(): void {
    this.start.emit(this.routine.id);
  }

  onToggleTask(task: any, event: Event): void {
    event.stopPropagation();
    const checkbox = event.target as HTMLInputElement;
    this.toggleTask.emit({
      routineId: this.routine.id,
      taskId: task.id,
      completed: checkbox.checked
    });
  }
}

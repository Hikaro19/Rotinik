import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routine } from '@core/services/routine.service';
import { AppCardComponent } from '../../ui/card/card.component';
import { AppButtonComponent } from '../../ui/button/button.component';

/**
 * RoutineCardComponent: Card que exibe uma rotina com progresso
 */
@Component({
  selector: 'app-routine-card',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppButtonComponent],
  template: `
    <app-card
      variant="default"
      padding="md"
      rounded="md"
      [clickable]="true"
      role="article"
      [attr.aria-label]="routine.title"
    >
      <!-- Header com ícone e título -->
      <div appCardHeader class="routine-card__header">
        <div class="routine-card__icon" [style.color]="routine.color">
          {{ routine.icon }}
        </div>
        <div class="routine-card__title-group">
          <h3 class="routine-card__title">{{ routine.title }}</h3>
          <p class="routine-card__frequency">
            <span class="routine-card__frequency-badge">{{ frequencyLabel() }}</span>
          </p>
        </div>
      </div>

      <!-- Progresso -->
      <div class="routine-card__content">
        <p *ngIf="routine.description" class="routine-card__description">
          {{ routine.description }}
        </p>

        <!-- Barra de Progresso -->
        <div class="routine-card__progress">
          <div class="routine-card__progress-bar">
            <div
              class="routine-card__progress-fill"
              [style.width.%]="progressPercentage()"
              [style.backgroundColor]="routine.color"
            ></div>
          </div>
          <p class="routine-card__progress-text">
            {{ completedTaskCount() }} / {{ routine.tasks.length }} tarefas
          </p>
        </div>

        <!-- Stats -->
        <div class="routine-card__stats">
          <div class="routine-card__stat">
            <span class="routine-card__stat-icon">⭐</span>
            <span class="routine-card__stat-value">{{ routine.totalXP }} XP</span>
          </div>
          <div class="routine-card__stat">
            <span class="routine-card__stat-icon">💰</span>
            <span class="routine-card__stat-value">{{ routine.totalCoins }} moedas</span>
          </div>
          <div *ngIf="routine.completionStreak > 0" class="routine-card__stat routine-card__stat--streak">
            <span class="routine-card__stat-icon">🔥</span>
            <span class="routine-card__stat-value">{{ routine.completionStreak }} dias</span>
          </div>
        </div>
      </div>

      <!-- Footer com ações -->
      <div appCardFooter class="routine-card__footer">
        <app-button
          variant="ghost"
          size="sm"
          (buttonClick)="onEdit()"
          [attr.aria-label]="'Editar rotina ' + routine.title"
        >
          ✏️ Editar
        </app-button>
        <app-button
          variant="primary"
          size="sm"
          (buttonClick)="onStart()"
          [attr.aria-label]="'Iniciar rotina ' + routine.title"
        >
          ► Iniciar
        </app-button>
      </div>
    </app-card>
  `,
  styleUrl: './routine-card.component.scss',
})
export class AppRoutineCardComponent {
  @Input() routine!: Routine;
  @Output() edit = new EventEmitter<string>(); // routineId
  @Output() start = new EventEmitter<string>(); // routineId

  frequencyLabel = () => {
    const labels: Record<Routine['frequency'], string> = {
      daily: 'Diariamente',
      weekly: 'Semanalmente',
      monthly: 'Mensalmente',
    };
    return labels[this.routine.frequency];
  };

  completedTaskCount = () => {
    return this.routine.tasks.filter((t) => t.completed).length;
  };

  progressPercentage = () => {
    if (this.routine.tasks.length === 0) return 0;
    const completed = this.routine.tasks.filter((t) => t.completed).length;
    return (completed / this.routine.tasks.length) * 100;
  };

  onEdit(): void {
    this.edit.emit(this.routine.id);
  }

  onStart(): void {
    this.start.emit(this.routine.id);
  }
}

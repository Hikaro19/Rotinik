import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@core/services/routine.service';

/**
 * TaskItemComponent: Renderiza uma tarefa individual com checkbox
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [class.task-item--completed]="task.completed">
      <!-- Checkbox -->
      <input
        type="checkbox"
        class="task-item__checkbox"
        [checked]="task.completed"
        (change)="onToggle()"
        [attr.aria-label]="'Marcar tarefa: ' + task.title"
      />

      <!-- Conteúdo -->
      <div class="task-item__content">
        <h4 class="task-item__title">{{ task.title }}</h4>
        <p *ngIf="task.description" class="task-item__description">
          {{ task.description }}
        </p>
      </div>

      <!-- Rewards -->
      <div class="task-item__rewards">
        <span class="task-item__reward task-item__reward--xp" [title]="'XP: ' + task.xpReward">
          ⭐ {{ task.xpReward }}
        </span>
        <span class="task-item__reward task-item__reward--coin" [title]="'Moedas: ' + task.coinReward">
          💰 {{ task.coinReward }}
        </span>
      </div>

      <!-- Delete Button -->
      <button
        type="button"
        class="task-item__delete"
        aria-label="Deletar tarefa"
        (click)="onDelete()"
        *ngIf="!task.completed"
      >
        ✕
      </button>
    </div>
  `,
  styleUrl: './task-item.component.scss',
})
export class AppTaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<string>(); // taskId
  @Output() delete = new EventEmitter<string>(); // taskId

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}

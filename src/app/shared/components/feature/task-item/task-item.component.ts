import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '@core/services/routine.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [class.task-item--completed]="task.completed">
      <input
        type="checkbox"
        class="task-item__checkbox"
        [checked]="task.completed"
        (change)="onToggle()"
        [attr.aria-label]="'Marcar tarefa: ' + task.title"
      />

      <div class="task-item__content">
        <h4 class="task-item__title">{{ task.title }}</h4>
        <p *ngIf="task.description" class="task-item__description">
          {{ task.description }}
        </p>
      </div>

      <div class="task-item__meta">
        <span class="task-item__pill">{{ task.estimatedMinutes }} min</span>
        <span class="task-item__pill">{{ importanceLabel }}</span>
      </div>

      <div class="task-item__actions">
        <button
          type="button"
          class="task-item__icon-button"
          aria-label="Editar tarefa"
          (click)="onEdit()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
          </svg>
        </button>
        <button
          *ngIf="!task.completed"
          type="button"
          class="task-item__icon-button task-item__icon-button--danger"
          aria-label="Excluir tarefa"
          (click)="onDelete()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrl: './task-item.component.scss',
})
export class AppTaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  get importanceLabel(): string {
    const labels: Record<Task['importance'], string> = {
      baixa: 'Baixa',
      media: 'Media',
      alta: 'Alta',
      critica: 'Critica',
    };

    return labels[this.task.importance];
  }

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskViewModel } from '../../models/routine-view.models';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card" [ngClass]="{ 'task-completed': task.completed }">
      <div class="task-left">
        <div class="task-title-row">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-icon-actions">
            <button class="task-icon-btn" type="button" aria-label="Editar" (click)="edit.emit(task)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>
              </svg>
            </button>
            <button class="task-icon-btn task-icon-btn--danger" type="button" aria-label="Excluir" (click)="delete.emit(task.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </div>
        <p class="task-description" *ngIf="task.description">{{ task.description }}</p>
        <div class="task-meta">
          <span class="task-state" [ngClass]="'state-' + (task.completed ? 'completed' : 'pending')">
            {{ task.completed ? 'Concluída' : 'Pendente' }}
          </span>
          <span class="task-importance" [ngClass]="'importance-' + task.importance">
            {{ task.importance | titlecase }}
          </span>
          <span class="task-time">{{ task.estimatedMinutes }} min</span>
        </div>
      </div>
      <div class="task-right">
        <!-- O botão agora usa sempre a classe btn-small com o SVG -->
        <button *ngIf="!task.completed" 
                class="btn-action btn-small" 
                [disabled]="busy" 
                (click)="complete.emit(task.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 12 4 4L19 6" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Fundo degradê e borda aplicados diretamente a todos os cards */
    .task-card { 
      display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-4); 
      border: 1px solid rgba(168, 85, 247, 0.28); 
      border-radius: 16px; 
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.14), rgba(255, 255, 255, 0.035)); 
      padding: var(--spacing-4); 
      transition: background-color var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base); 
      margin-bottom: var(--spacing-3); 
    }
    .task-card:hover { border-color: rgba(217, 70, 239, 0.4); background: rgba(255, 255, 255, 0.06); box-shadow: 0 12px 28px rgba(168, 85, 247, 0.16); transform: translateY(-2px); }
    .task-left { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: var(--spacing-2); }
    .task-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--spacing-3); }
    .task-title { margin: 0; color: var(--text-primary); font-size: var(--font-size-base); font-weight: var(--font-bold); line-height: var(--line-height-tight); }
    .task-description { margin: 0; color: var(--text-secondary); font-size: var(--font-size-sm); line-height: var(--line-height-normal); }
    .task-meta, .task-icon-actions, .task-right { display: flex; align-items: center; gap: var(--spacing-2); }
    .task-meta { flex-wrap: wrap; }
    .task-state, .task-importance, .task-time { display: inline-flex; align-items: center; border-radius: 9999px; font-size: var(--font-size-xs); font-weight: var(--font-semibold); min-height: 26px; padding: 0 10px; }
    .state-pending { background: rgba(245, 158, 11, 0.12); color: #fbbf24; }
    .state-completed { background: rgba(16, 185, 129, 0.12); color: #4ade80; }
    .importance-baixa { border: 1px solid rgba(16, 185, 129, 0.42); color: #6ee7b7; }
    .importance-media { border: 1px solid rgba(245, 158, 11, 0.42); color: #fcd34d; }
    .importance-alta { border: 1px solid rgba(249, 115, 22, 0.42); color: #fdba74; }
    .importance-critica { border: 1px solid rgba(239, 68, 68, 0.48); background: rgba(239, 68, 68, 0.12); color: #fca5a5; }
    .task-time { background: rgba(167, 139, 250, 0.1); color: #c4b5fd; }
    .task-icon-actions { flex-shrink: 0; }
    .task-icon-btn { display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center; border: 0; border-radius: 9999px; background: transparent; color: var(--text-secondary); cursor: pointer; transition: background-color var(--transition-base), color var(--transition-base); }
    .task-icon-btn svg { width: 17px; height: 17px; }
    .task-icon-btn:hover { background: rgba(255, 255, 255, 0.08); color: #ffffff; }
    .task-icon-btn--danger:hover { background: rgba(248, 113, 113, 0.12); color: #f87171; }
    .btn-action { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; border: 0; border-radius: 9999px; color: #ffffff; cursor: pointer; font-family: inherit; font-size: var(--font-size-sm); font-weight: var(--font-semibold); padding: 0 var(--spacing-5); transition: box-shadow var(--transition-base), opacity var(--transition-base), transform var(--transition-base); }
    .btn-action:disabled { cursor: not-allowed; opacity: 0.5; }
    .btn-small { background: var(--brand-gradient); box-shadow: 0 6px 18px rgba(168, 85, 247, 0.32); width: 42px; padding: 0; }
    .btn-action:not(:disabled):hover { box-shadow: 0 10px 26px rgba(168, 85, 247, 0.44); transform: translateY(-1px); }
    .btn-small svg { width: 18px; height: 18px; }
    .task-completed { opacity: 0.72; }
    .task-completed .task-title { color: var(--text-muted); text-decoration: line-through; }

    /* Responsividade Mapeada */
    @media (max-width: 768px) {
      .task-card { align-items: flex-start; flex-direction: column; }
      .task-right { align-self: stretch; justify-content: flex-end; }
    }
    @media (max-width: 420px) {
      .task-title-row { flex-direction: column; }
      .task-icon-actions { align-self: flex-end; }
    }
  `]
})

export class TaskItemComponent {
  @Input({ required: true }) task!: TaskViewModel;
  @Input() busy = false;

  @Output() complete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<TaskViewModel>();
  @Output() delete = new EventEmitter<string>();
}
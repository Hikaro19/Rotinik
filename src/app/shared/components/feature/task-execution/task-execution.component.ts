import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, stagger } from '@angular/animations';
import { RoutineService, Task, Routine } from '@core/services/routine.service';
import { AppCardComponent } from '../../ui/card/card.component';
import { AppButtonComponent } from '../../ui/button/button.component';
import { AppSpinnerComponent } from '../../ui/spinner/spinner.component';
import { AppTaskRewardComponent } from '../task-reward/task-reward.component';

/**
 * TaskExecutionComponent: Execução passo-a-passo de tarefas com feedback visual
 */
@Component({
  selector: 'app-task-execution',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    AppSpinnerComponent,
    AppTaskRewardComponent,
  ],
  template: `
    <div class="task-execution">
      <div *ngIf="currentTask(); else completedView" class="task-execution__container">
        <!-- Progress Header -->
        <div class="task-execution__progress">
          <div class="progress-item">
            <span class="progress-label">Tarefa</span>
            <span class="progress-value">{{ currentTaskIndex() + 1 }} / {{ routine.tasks.length }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="progressPercentage()"
              [@expandWidth]
            ></div>
          </div>
        </div>

        <!-- Current Task Card -->
        <app-card
          variant="elevated"
          padding="lg"
          rounded="lg"
          role="region"
          aria-label="Tarefa atual"
          [@fadeIn]
        >
          <div class="task-execution__header">
            <h2 class="task-execution__title">{{ currentTask().title }}</h2>
            <p *ngIf="currentTask().description" class="task-execution__description">
              {{ currentTask().description }}
            </p>
          </div>

          <!-- Reward Preview -->
          <div class="task-execution__rewards" [@slideIn]>
            <div class="reward-badge">
              <span class="reward-badge__icon">⭐</span>
              <span class="reward-badge__value">+{{ currentTask().xpReward }} XP</span>
            </div>
            <div class="reward-badge">
              <span class="reward-badge__icon">💰</span>
              <span class="reward-badge__value">+{{ currentTask().coinReward }} moedas</span>
            </div>
          </div>

          <!-- Completion Checkbox -->
          <div class="task-execution__completion">
            <label class="completion-checkbox">
              <input
                type="checkbox"
                [checked]="currentTask().completed"
                (change)="onToggleTask()"
                [disabled]="isProcessing()"
              />
              <span class="completion-checkbox__label">
                {{ currentTask().completed ? 'Tarefa Completa!' : 'Marcar Como Completa' }}
              </span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="task-execution__actions">
            <app-button
              *ngIf="!currentTask().completed"
              variant="primary"
              size="lg"
              (buttonClick)="onCompleteTask()"
              [disabled]="isProcessing()"
            >
              {{ isProcessing() ? 'Processando...' : '✓ Completar Tarefa' }}
            </app-button>
            <app-button
              *ngIf="currentTask().completed"
              variant="primary"
              size="lg"
              [disabled]="true"
            >
              ✓ Tarefa Concluída
            </app-button>
            <app-button
              variant="ghost"
              size="md"
              (buttonClick)="onSkip()"
              [disabled]="isProcessing()"
            >
              Próxima
            </app-button>
          </div>
        </app-card>

        <!-- Task List Preview -->
        <app-card variant="outlined" padding="md" rounded="md" class="task-execution__preview">
          <h3 class="task-execution__preview-title">Tarefas Pendentes</h3>
          <div class="task-execution__task-list">
            <div
              *ngFor="let task of remainingTasks(); let i = index"
              [class.completed]="task.completed"
              [@staggerList]
              class="task-execution__task-item"
            >
              <span class="task-item__checkbox">{{ task.completed ? '✓' : '○' }}</span>
              <span class="task-item__title">{{ task.title }}</span>
              <span class="task-item__xp">{{ task.xpReward }} XP</span>
            </div>
          </div>
        </app-card>
      </div>

      <ng-template #completedView>
        <app-card
          variant="elevated"
          padding="lg"
          rounded="lg"
          class="task-execution__completion-view"
          [@bounceIn]
        >
          <div class="completion-banner">
            <div class="completion-banner__icon">🎉</div>
            <h2 class="completion-banner__title">Todas as Tarefas Concluídas!</h2>
            <p class="completion-banner__subtitle">
              Você completou todas as tarefas de
              <strong>{{ routine.title }}</strong>
            </p>

            <!-- Stats -->
            <div class="completion-stats">
              <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <div>
                  <p class="stat-label">XP Total</p>
                  <p class="stat-value">+{{ totalXpEarned() }}</p>
                </div>
              </div>
              <div class="stat-item">
                <span class="stat-icon">💰</span>
                <div>
                  <p class="stat-label">Moedas</p>
                  <p class="stat-value">+{{ totalCoinsEarned() }}</p>
                </div>
              </div>
              <div class="stat-item" *ngIf="routine.completionStreak > 0">
                <span class="stat-icon">🔥</span>
                <div>
                  <p class="stat-label">Streak</p>
                  <p class="stat-value">{{ routine.completionStreak }} dias</p>
                </div>
              </div>
            </div>

            <!-- Action -->
            <app-button
              variant="primary"
              size="lg"
              (buttonClick)="onClose()"
              class="completion-banner__button"
            >
              ← Voltar Para Rotinas
            </app-button>
          </div>
        </app-card>
      </ng-template>

      <!-- Reward Notification -->
      <app-task-reward
        *ngIf="lastReward() as reward"
        [xp]="reward.xp"
        [coins]="reward.coins"
        [streakBonus]="reward.streakBonus"
      ></app-task-reward>
    </div>
  `,
  styles: [
    `
      .task-execution {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 16px;
        max-width: 800px;
        margin: 0 auto;
      }

      .task-execution__container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .task-execution__progress {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .progress-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }

      .progress-label {
        font-weight: 500;
        color: var(--text-secondary);
      }

      .progress-value {
        font-weight: 600;
        color: var(--brand-neon);
      }

      .progress-bar {
        height: 8px;
        background: var(--surface-tertiary);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--brand-neon) 0%, var(--game-success) 100%);
        border-radius: 4px;
      }

      .task-execution__header {
        text-align: center;
        margin-bottom: 24px;
      }

      .task-execution__title {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 12px 0;
        color: var(--text-primary);
      }

      .task-execution__description {
        font-size: 16px;
        color: var(--text-secondary);
        margin: 0;
      }

      .task-execution__rewards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }

      .reward-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--surface-secondary);
        border-radius: 12px;
        font-weight: 600;
        color: var(--brand-neon);
      }

      .reward-badge__icon {
        font-size: 20px;
      }

      .task-execution__completion {
        margin: 24px 0;
      }

      .completion-checkbox {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
      }

      .completion-checkbox input {
        width: 24px;
        height: 24px;
        cursor: pointer;
        accent-color: var(--brand-neon);
      }

      .completion-checkbox__label {
        cursor: pointer;
      }

      .task-execution__actions {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        margin-top: 24px;
      }

      .task-execution__preview {
        margin-top: 16px;
      }

      .task-execution__preview-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .task-execution__task-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .task-execution__task-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: var(--surface-secondary);
        border-radius: 8px;
        font-size: 14px;
        transition: opacity 0.3s ease;
      }

      .task-execution__task-item.completed {
        opacity: 0.6;
        text-decoration: line-through;
      }

      .task-item__checkbox {
        flex-shrink: 0;
        font-weight: 600;
        color: var(--brand-neon);
      }

      .task-item__title {
        flex: 1;
      }

      .task-item__xp {
        font-weight: 600;
        color: var(--game-xp);
        font-size: 12px;
      }

      .task-execution__completion-view {
        margin: 0 auto;
      }

      .completion-banner {
        text-align: center;
      }

      .completion-banner__icon {
        font-size: 64px;
        margin-bottom: 16px;
        animation: bounce 1s ease-in-out infinite;
      }

      .completion-banner__title {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: var(--brand-neon);
      }

      .completion-banner__subtitle {
        font-size: 16px;
        color: var(--text-secondary);
        margin: 0 0 32px 0;
      }

      .completion-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--surface-secondary);
        border-radius: 12px;
      }

      .stat-icon {
        font-size: 24px;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-secondary);
        margin: 0;
      }

      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--brand-neon);
        margin: 0;
      }

      .completion-banner__button {
        width: 100%;
      }

      @keyframes bounce {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      @media (max-width: 640px) {
        .task-execution {
          padding: 12px;
          gap: 16px;
        }

        .task-execution__title {
          font-size: 24px;
        }

        .task-execution__rewards {
          grid-template-columns: 1fr;
        }

        .task-execution__actions {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('staggerList', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms 100ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('expandWidth', [
      transition(':increment', [animate('300ms ease-out')]),
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppTaskExecutionComponent implements OnInit {
  @Input() routine!: Routine;
  @Input() onCloseCallback?: () => void;

  routineService = inject(RoutineService);

  currentTaskIndexSignal = signal(0);
  isProcessingSignal = signal(false);
  lastRewardSignal = signal<{ xp: number; coins: number; streakBonus: number } | null>(null);

  currentTaskIndex = () => this.currentTaskIndexSignal();
  currentTask = computed(() => {
    return this.routine.tasks[this.currentTaskIndexSignal()];
  });
  isProcessing = () => this.isProcessingSignal();
  lastReward = () => this.lastRewardSignal();

  remainingTasks = computed(() => {
    return this.routine.tasks.slice(this.currentTaskIndexSignal() + 1);
  });

  progressPercentage = computed(() => {
    const completed = this.routine.tasks.filter((t) => t.completed).length;
    return (completed / this.routine.tasks.length) * 100;
  });

  totalXpEarned = computed(() => {
    return this.routine.tasks.reduce((sum, task) => (task.completed ? sum + task.xpReward : sum), 0);
  });

  totalCoinsEarned = computed(() => {
    return this.routine.tasks.reduce((sum, task) => (task.completed ? sum + task.coinReward : sum), 0);
  });

  ngOnInit(): void {
    // Advance to first incomplete task
    const firstIncompleteIndex = this.routine.tasks.findIndex((t) => !t.completed);
    if (firstIncompleteIndex !== -1) {
      this.currentTaskIndexSignal.set(firstIncompleteIndex);
    } else {
      this.currentTaskIndexSignal.set(0);
    }
  }

  onCompleteTask(): void {
    const task = this.currentTask();
    if (!task || task.completed) return;

    this.isProcessingSignal.set(true);

    // Add small delay for visual feedback
    setTimeout(() => {
      const reward = this.routineService.completeTask(this.routine.id, task.id);
      this.lastRewardSignal.set({
        xp: reward.xp,
        coins: reward.coins,
        streakBonus: 0,
      });

      this.isProcessingSignal.set(false);
      this.toNextIncompleteTask();
    }, 600);
  }

  onToggleTask(): void {
    const task = this.currentTask();
    if (!task) return;

    if (task.completed) {
      this.routineService.uncompleteTask(this.routine.id, task.id);
    } else {
      this.onCompleteTask();
    }
  }

  onSkip(): void {
    this.toNextIncompleteTask();
  }

  private toNextIncompleteTask(): void {
    const nextIndex = this.routine.tasks.findIndex((t, idx) => idx > this.currentTaskIndexSignal() && !t.completed);
    if (nextIndex !== -1) {
      this.currentTaskIndexSignal.set(nextIndex);
    } else {
      // All tasks completed or at end
      this.currentTaskIndexSignal.set(this.routine.tasks.length);
    }
  }

  onClose(): void {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }
}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * TaskRewardComponent: Exibe recompensas ganhas ao completar uma tarefa
 * Com animações e feedback visual
 */
@Component({
  selector: 'app-task-reward',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-reward" @bounceIn *ngIf="isVisible">
      <div class="task-reward__container">
        <!-- XP Reward -->
        <div class="task-reward__item" *ngIf="xp > 0">
          <div class="task-reward__icon task-reward__icon--xp">⭐</div>
          <div class="task-reward__content">
            <p class="task-reward__label">XP Ganho</p>
            <p class="task-reward__value" [class.task-reward__value--animate]="shouldAnimate">
              +{{ xp }}
            </p>
          </div>
        </div>

        <!-- Coin Reward -->
        <div class="task-reward__item" *ngIf="coins > 0">
          <div class="task-reward__icon task-reward__icon--coin">💰</div>
          <div class="task-reward__content">
            <p class="task-reward__label">Moedas</p>
            <p class="task-reward__value" [class.task-reward__value--animate]="shouldAnimate">
              +{{ coins }}
            </p>
          </div>
        </div>

        <!-- Streak Bonus -->
        <div class="task-reward__item" *ngIf="streakBonus > 0">
          <div class="task-reward__icon task-reward__icon--streak">🔥</div>
          <div class="task-reward__content">
            <p class="task-reward__label">Streak Bonus</p>
            <p class="task-reward__value" [class.task-reward__value--animate]="shouldAnimate">
              +{{ streakBonus }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button
        type="button"
        class="task-reward__close"
        (click)="close()"
        aria-label="Fechar recompensa"
      >
        ✕
      </button>
    </div>
  `,
  styles: [
    `
      .task-reward {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        animation: slideDown 0.5s ease-out;
      }

      .task-reward__container {
        background: linear-gradient(135deg, var(--brand-neon) 0%, var(--game-success) 100%);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
        backdrop-filter: blur(10px);
      }

      .task-reward__item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: white;
        text-align: center;
      }

      .task-reward__icon {
        flex-shrink: 0;
        font-size: 28px;
        line-height: 1;
      }

      .task-reward__icon--xp {
        animation: bounce 0.6s ease-in-out;
      }

      .task-reward__icon--coin {
        animation: spin 0.6s ease-in-out;
      }

      .task-reward__icon--streak {
        animation: pulse 0.6s ease-in-out;
      }

      .task-reward__content {
        text-align: left;
      }

      .task-reward__label {
        font-size: 12px;
        font-weight: 500;
        opacity: 0.9;
        margin: 0;
      }

      .task-reward__value {
        font-size: 20px;
        font-weight: 700;
        margin: 4px 0 0 0;
        color: #fff;
        transition: transform 0.3s ease;
      }

      .task-reward__value--animate {
        animation: scaleUp 0.6s ease-out;
      }

      .task-reward__close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 18px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .task-reward__close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-12px);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
      }

      @keyframes scaleUp {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        0% {
          transform: translate(-50%, -150%);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
      }
    `,
  ],
  animations: [
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'scale(0.3)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppTaskRewardComponent implements OnInit, OnDestroy {
  @Input() xp = 0;
  @Input() coins = 0;
  @Input() streakBonus = 0;
  @Input() autoCloseMs = 4000;

  isVisible = true;
  shouldAnimate = false;
  private closeTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.shouldAnimate = true;
    this.closeTimer = setTimeout(() => {
      this.close();
    }, this.autoCloseMs);
  }

  ngOnDestroy(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  close(): void {
    this.isVisible = false;
  }
}

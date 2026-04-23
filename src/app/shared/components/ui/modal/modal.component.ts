import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../card/card.component';
import { AppSpinnerComponent } from '../spinner/spinner.component';
import { AppButtonComponent } from '../button/button.component';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppSpinnerComponent, AppButtonComponent],
  template: `
    <!-- Backdrop -->
    <div
      *ngIf="isOpen()"
      class="app-modal__backdrop"
      (click)="onBackdropClick()"
      [attr.aria-hidden]="'true'"
    ></div>

    <!-- Modal Container -->
    <div *ngIf="isOpen()" class="app-modal__container" [class.app-modal__container--open]="isOpen()">
      <div class="app-modal__dialog" [class]="dialogClasses()">
        <!-- Use Card as wrapper -->
        <app-card
          variant="elevated"
          [padding]="'none'"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="headerId"
        >
          <!-- Modal Header -->
          <div appCardHeader class="app-modal__header">
            <h2 [id]="headerId" class="app-modal__title">
              {{ title }}
            </h2>
            <button
              *ngIf="closeable"
              type="button"
              class="app-modal__close-btn"
              aria-label="Fechar modal"
              (click)="close()"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading()" class="app-modal__loading">
            <app-spinner size="md" [showText]="true" [text]="loadingText"></app-spinner>
          </div>

          <!-- Modal Content -->
          <div *ngIf="!isLoading()" class="app-modal__content">
            <ng-content></ng-content>
          </div>

          <!-- Modal Footer (if action buttons exist) -->
          <div *ngIf="!isLoading() && (primaryAction || secondaryAction)" class="app-modal__footer">
            <app-button
              *ngIf="secondaryAction"
              variant="ghost"
              size="md"
              (buttonClick)="onSecondaryAction()"
            >
              {{ secondaryActionLabel }}
            </app-button>
            <app-button
              *ngIf="primaryAction"
              variant="primary"
              size="md"
              [loading]="isLoading()"
              [disabled]="isLoading()"
              (buttonClick)="onPrimaryAction()"
            >
              {{ primaryActionLabel }}
            </app-button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalComponent {
  @Input() title = 'Modal';
  @Input() size: ModalSize = 'md';
  @Input() closeable = true;
  @Input() closeOnBackdrop = true;
  @Input() primaryActionLabel = 'Confirmar';
  @Input() secondaryActionLabel = 'Cancelar';
  @Input() loadingText = 'Processando...';

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  // Signals
  isOpen = signal(false);
  isLoading = signal(false);

  // Generate unique ID for aria-labelledby
  headerId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;

  // Computed
  dialogClasses = computed(() => {
    const base = 'app-modal__dialog';
    const sizeClass = `app-modal__dialog--${this.size}`;

    return [base, sizeClass].filter(Boolean).join(' ');
  });

  // Methods
  open(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
    this.onClose.emit();
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop && this.closeable) {
      this.close();
    }
  }

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}

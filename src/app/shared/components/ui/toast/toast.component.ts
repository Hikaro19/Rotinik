import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="toastClasses()" role="alert" aria-live="polite" [@slideIn]>
      <div class="app-toast__icon">
        <svg *ngIf="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg *ngIf="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <svg *ngIf="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <svg *ngIf="type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>

      <div class="app-toast__content">
        <h4 *ngIf="title" class="app-toast__title">{{ title }}</h4>
        <p class="app-toast__message">{{ message }}</p>
      </div>

      <button *ngIf="closeable" type="button" class="app-toast__close" aria-label="Fechar notificacao" (click)="onClose()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div *ngIf="duration && duration > 0" class="app-toast__progress" [style.--duration]="duration + 'ms'"></div>
    </div>
  `,
  styleUrl: './toast.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppToastComponent {
  @Input() type: ToastType = 'info';
  @Input() title?: string;
  @Input() message = '';
  @Input() duration = 4000;
  @Input() closeable = true;

  @Output() close = new EventEmitter<void>();

  toastClasses = computed(() => {
    const base = 'app-toast';
    const typeClass = `app-toast--${this.type}`;
    return [base, typeClass].filter(Boolean).join(' ');
  });

  onClose(): void {
    this.close.emit();
  }
}

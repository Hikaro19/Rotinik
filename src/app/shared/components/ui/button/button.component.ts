import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled || loading"
      (click)="onClick()"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
    >
      <span *ngIf="!loading" class="button-text">
        <ng-content></ng-content>
      </span>
      <span *ngIf="loading" class="button-spinner">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" />
        </svg>
      </span>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class AppButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Output() buttonClick = new EventEmitter<void>();

  buttonClasses = computed(() => {
    const base = 'app-button';
    const variantClass = `app-button--${this.variant}`;
    const sizeClass = `app-button--${this.size}`;
    const widthClass = this.fullWidth ? 'app-button--full' : '';
    const stateClass = this.disabled ? 'app-button--disabled' : '';

    return [base, variantClass, sizeClass, widthClass, stateClass].filter(Boolean).join(' ');
  });

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}

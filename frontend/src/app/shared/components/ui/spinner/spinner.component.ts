import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="spinnerClasses()" [attr.role]="'status'" [attr.aria-label]="ariaLabel">
      <!-- Spinner Animation -->
      <svg
        class="app-spinner__svg"
        [attr.viewBox]="'0 0 50 50'"
        [attr.width]="sizePixels()"
        [attr.height]="sizePixels()"
      >
        <circle
          class="app-spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="31.4 125.6"
        />
      </svg>

      <!-- Loading Text (optional) -->
      <span *ngIf="showText" class="app-spinner__text">
        {{ text }}
      </span>
    </div>
  `,
  styleUrl: './spinner.component.scss',
})
export class AppSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() variant: SpinnerVariant = 'primary';
  @Input() showText = false;
  @Input() text = 'Carregando...';
  @Input() ariaLabel = 'Carregando...';

  // Map sizes to pixels
  sizePixels = computed(() => {
    const sizeMap: Record<SpinnerSize, number> = {
      xs: 16,
      sm: 24,
      md: 40,
      lg: 56,
      xl: 80,
    };
    return sizeMap[this.size];
  });

  // Computed classes
  spinnerClasses = computed(() => {
    const base = 'app-spinner';
    const sizeClass = `app-spinner--${this.size}`;
    const variantClass = `app-spinner--${this.variant}`;

    return [base, sizeClass, variantClass].filter(Boolean).join(' ');
  });
}

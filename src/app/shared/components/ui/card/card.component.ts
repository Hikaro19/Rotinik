import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()" [attr.role]="role">
      <!-- Header Section -->
      <div *ngIf="hasHeader()" class="app-card__header">
        <div class="app-card__header-content">
          <ng-content select="[appCardHeader]"></ng-content>
        </div>
        <div *ngIf="hasHeaderRight()" class="app-card__header-right">
          <ng-content select="[appCardHeaderRight]"></ng-content>
        </div>
      </div>

      <!-- Divider (if header exists) -->
      <hr *ngIf="hasHeader() && divider" class="app-card__divider" aria-hidden="true" />

      <!-- Content Section -->
      <div class="app-card__content">
        <ng-content></ng-content>
      </div>

      <!-- Footer Section -->
      <div *ngIf="hasFooter()" class="app-card__footer">
        <hr *ngIf="divider" class="app-card__divider" aria-hidden="true" />
        <ng-content select="[appCardFooter]"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './card.component.scss',
})
export class AppCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() clickable = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: 'sm' | 'md' | 'lg' = 'md';
  @Input() divider = true;
  @Input() role: string = 'article';
  @Input() ariaLabel?: string;

  // Signals for content detection
  hasHeader = signal(false);
  hasFooter = signal(false);
  hasHeaderRight = signal(false);

  // Computed styles
  cardClasses = computed(() => {
    const base = 'app-card';
    const variantClass = `app-card--${this.variant}`;
    const paddingClass = `app-card--padding-${this.padding}`;
    const radiusClass = `app-card--radius-${this.rounded}`;
    const clickableClass = this.clickable ? 'app-card--clickable' : '';

    return [base, variantClass, paddingClass, radiusClass, clickableClass]
      .filter(Boolean)
      .join(' ');
  });

  constructor() {
    // Detectar conteúdo em slots
    setTimeout(() => {
      this.detectSlots();
    }, 0);
  }

  private detectSlots(): void {
    // Esta é uma simplificação - em produção, use ContentChild
    // Para agora, assumir que header/footer existem se definidos
  }

  // Métodos para detectar slots (usando ng-content projection)
  ngAfterContentInit() {
    // Este componente usa ng-content simples
    // Você pode expandir com @ContentChild se necessário
  }
}

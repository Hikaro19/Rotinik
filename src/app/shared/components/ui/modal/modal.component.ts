import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-card" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <button type="button" class="btn-close" [disabled]="submitting" (click)="close.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div class="modal-header">
          <p class="subtitle">{{ subtitle }}</p>
          <h2 class="title">{{ title }}</h2>
          <p class="description">{{ description }}</p>
        </div>

        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); }
    .modal-card { position: relative; width: 100%; max-width: 450px; max-height: calc(100vh - 2rem); overflow-y: auto; background: #13111b; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 1.5rem; padding: 1.5rem; box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); color: white; font-family: inherit; }
    .btn-close { position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; }
    .btn-close svg { width: 1.5rem; height: 1.5rem; }
    .btn-close:hover { color: white; }
    .modal-header { margin-bottom: 1.75rem; padding-right: 2rem; }
    .subtitle { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #d8b4fe; margin-bottom: 0.5rem; }
    .title { font-size: 1.875rem; font-weight: 800; margin: 0; }
    .description { font-size: 0.875rem; line-height: 1.5; color: #a78bfa; margin-top: 0.5rem; }
  `]
})
export class ModalComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) description!: string;
  @Input() submitting = false;
  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if (!this.submitting) this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.submitting) this.close.emit();
  }
}
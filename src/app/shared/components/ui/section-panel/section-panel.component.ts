import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-panel">
      <div *ngIf="title || badge" class="section-panel__header">
        <h2 *ngIf="title" class="section-panel__title">{{ title }}</h2>
        <span *ngIf="badge" class="section-panel__badge">{{ badge }}</span>
      </div>
      <div class="section-panel__content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styleUrl: './section-panel.component.scss',
})
export class AppSectionPanelComponent {
  @Input() title = '';
  @Input() badge = '';
}

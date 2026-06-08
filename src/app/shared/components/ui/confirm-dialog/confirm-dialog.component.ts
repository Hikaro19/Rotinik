import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AppButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() kicker = 'Ação Importante';
  @Input() isDestructive = false;
  @Input() title = 'Confirmar acao';
  @Input() message = 'Deseja continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() loading = false;
  @Output() decision = new EventEmitter<boolean>();

  confirm(): void {
    if (this.loading) {
      return;
    }

    this.decision.emit(true);
  }

  cancel(): void {
    this.fecharModal();
  }

  fecharModal(): void {
    if (this.loading) {
      return;
    }

    this.decision.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.fecharModal();
  }
}

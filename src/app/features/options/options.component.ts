import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../users/services/auth-facade.service';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacadeService);

  isDeleteModalOpen = false;
  deleteConfirmText = '';
  
  dialogConfig = signal<{ isOpen: boolean; title: string; message: string; isDestructive: boolean } | null>(null);

  openDialog(title: string, message: string, isDestructive: boolean): void {
    this.dialogConfig.set({
      isOpen: true,
      title,
      message,
      isDestructive
    });
  }

  closeDialog(): void {
    const wasDeleted = this.dialogConfig()?.title === 'Aviso';
    this.dialogConfig.set(null);
    if (wasDeleted) {
      this.authFacade.logout();
    }
  }

  navigateToPremium() {
    this.router.navigate(['/premium']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToSecurity() {
    // Rota de segurança (pode ser criada depois)
    console.log('Navegar para Segurança');
  }

  navigateToSettings() {
    // Rota de configurações (pode ser criada depois)
    console.log('Navegar para Configurações');
  }

  navigateToHelp() {
    // Rota de ajuda (pode ser criada depois)
    console.log('Navegar para Ajuda');
  }

  logout() {
    this.authFacade.logout();
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
    this.deleteConfirmText = '';
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deleteConfirmText = '';
  }

  async confirmAccountDeletion() {
    if (this.deleteConfirmText !== 'EXCLUIR') {
      return;
    }

    try {
      const response = await this.authFacade.deleteAccount();
      this.closeDeleteModal();
      this.openDialog('Aviso', response.message || 'Sua conta foi agendada para exclusão e será removida em 30 dias. Para cancelar, basta fazer login novamente.', false);
    } catch (error) {
      this.closeDeleteModal();
      this.openDialog('Erro', 'Erro ao excluir conta. Tente novamente.', true);
      console.error('Delete account error:', error);
    }
  }
}

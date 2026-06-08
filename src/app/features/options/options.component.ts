import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../users/services/auth-facade.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacadeService);

  isDeleteModalOpen = false;
  deleteConfirmText = '';

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
      alert(response.message || 'Sua conta foi agendada para exclusão. Você tem 30 dias para cancelar fazendo login novamente.');
      this.closeDeleteModal();
    } catch (error) {
      alert('Erro ao excluir conta. Tente novamente.');
      console.error('Delete account error:', error);
    }
  }
}

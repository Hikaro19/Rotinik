import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="options-container">
      <div class="options-list">
        <button class="option-btn" (click)="navigateToProfile()">
          <span class="option-icon">👤</span>
          <span class="option-text">Editar Perfil</span>
        </button>

        <button class="option-btn" (click)="navigateToSecurity()">
          <span class="option-icon">🔒</span>
          <span class="option-text">Segurança</span>
        </button>

        <button class="option-btn" (click)="navigateToSettings()">
          <span class="option-icon">⚙️</span>
          <span class="option-text">Configurações</span>
        </button>

        <button class="option-btn" (click)="navigateToHelp()">
          <span class="option-icon">❓</span>
          <span class="option-text">Ajuda</span>
        </button>

        <button class="option-btn logout-btn" (click)="logout()">
          <span class="option-icon">🚪</span>
          <span class="option-text">Sair</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .options-container {
      padding: 16px;
      min-height: 100%;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .option-btn {
      width: 100%;
      padding: 16px;
      border: 2px dashed rgba(100, 200, 255, 0.3);
      border-radius: 12px;
      background: var(--purple-primary, #9B51E0);
      color: var(--text-primary, #FFFFFF);
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      background: rgba(155, 81, 224, 0.9);
      border-color: rgba(100, 200, 255, 0.5);
      transform: translateY(-2px);
    }

    .option-btn:active {
      transform: translateY(0);
      background: rgba(155, 81, 224, 0.8);
    }

    .option-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;
      text-align: left;
    }

    .logout-btn {
      background: linear-gradient(135deg, #A855F7 0%, #7C3AED 100%);
      margin-top: 12px;
      border-color: rgba(255, 71, 182, 0.3);
    }

    .logout-btn:hover {
      background: linear-gradient(135deg, #9945E6 0%, #6D2FD7 100%);
      border-color: rgba(255, 71, 182, 0.5);
    }

    @media (max-width: 480px) {
      .options-container {
        padding: 12px;
      }

      .options-list {
        gap: 10px;
      }

      .option-btn {
        padding: 14px 12px;
        font-size: 15px;
      }

      .option-icon {
        font-size: 20px;
      }
    }
  `],
})
export class OptionsComponent {
  private router = inject(Router);

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
    // Implementar logout (limpar sessão, token, etc.) depois
    this.router.navigate(['/auth/login']);
  }
}

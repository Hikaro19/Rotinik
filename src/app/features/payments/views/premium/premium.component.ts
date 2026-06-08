import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { finalize, take } from 'rxjs/operators';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, AppToastComponent, AppButtonComponent],
  templateUrl: './premium.component.html',
  styleUrl: './premium.component.scss',
})
export class PremiumComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacadeService);

  readonly isSubscribing = signal(false);
  readonly toastMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly advantages = [
    { icon: '🚀', text: 'Até 15 rotinas ativas simultaneamente' },
    { icon: '📋', text: 'Até 30 tarefas por rotina' },
    { icon: '⭐', text: 'Mais tarefas de prioridade Alta e Crítica' },
    { icon: '🛍️', text: '15% de desconto em toda a Loja' },
    { icon: '🏅', text: 'Medalhas exclusivas no Perfil' }
  ];

  goBack(): void {
    // Retorna para options ou para home caso o historico seja confuso
    this.router.navigate(['/options']);
  }

  subscribe(plan: 'monthly' | 'yearly'): void {
    if (this.isSubscribing()) return;

    this.isSubscribing.set(true);
    this.errorMessage.set(null);
    this.toastMessage.set(null);

    this.http.post<{ message: string }>(`${environment.apiBaseUrl}/user/upgrade-premium`, {})
      .pipe(
        take(1),
        finalize(() => this.isSubscribing.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastMessage.set(response.message || 'Seja bem-vindo ao Premium!');
          this.authFacade.refreshSession();
          
          // Redirecionar após o toast
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        },
        error: (err) => {
          const errMsg = err?.error?.detail || err?.error?.message || err?.message || 'Falha ao processar assinatura.';
          if (errMsg.toLowerCase().includes('already premium')) {
             this.errorMessage.set('Sua conta já é Premium!');
          } else {
             this.errorMessage.set(errMsg);
          }
        }
      });
  }

  closeToast(): void {
    this.toastMessage.set(null);
  }
}

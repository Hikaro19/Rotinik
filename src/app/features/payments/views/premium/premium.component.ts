import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { finalize, take } from 'rxjs/operators';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';
import { MedalNotificationService } from '@core/services/medal-notification.service';
import { RoutineService } from '@core/services/routine.service';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, AppToastComponent, AppButtonComponent, ConfirmDialogComponent],
  templateUrl: './premium.component.html',
  styleUrl: './premium.component.scss',
})
export class PremiumComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacadeService);
  private readonly routineService = inject(RoutineService);
  private readonly medalNotificationService = inject(MedalNotificationService);

  readonly isSubscribing = signal(false);
  readonly toastMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  
  dialogConfig = signal<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    isDestructive: boolean;
    showCancelButton?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
  } | null>(null);
  
  selectedPlan = signal<'monthly' | 'yearly' | null>(null);

  readonly advantages = [
    { icon: '🚀', text: 'Até 15 rotinas ativas simultaneamente' },
    { icon: '📋', text: 'Até 30 tarefas por rotina' },
    { icon: '⭐', text: 'Mais tarefas de prioridade Alta e Crítica' },
    { icon: '🛍️', text: '15% de desconto em toda a Loja' },
    { icon: '🏅', text: 'Medalhas exclusivas no Perfil' }
  ];

  goBack(): void {
    this.router.navigate(['/options']);
  }

  openSubscribeDialog(plan: 'monthly' | 'yearly'): void {
    this.selectedPlan.set(plan);
    const planName = plan === 'monthly' ? 'Mensal' : 'Anual';
    this.dialogConfig.set({
      isOpen: true,
      title: `Confirmar assinatura ${planName}`,
      message: `Você está prestes a assinar o plano ${planName} e desbloquear todos os benefícios Premium:\n\n🚀 Até 15 rotinas\n📋 30 tarefas por rotina\n⭐ Tarefas altas/críticas\n🛍️ 15% de desconto na loja\n🏅 Medalhas exclusivas\n\nDeseja confirmar a assinatura?`,
      isDestructive: false,
      showCancelButton: true,
      confirmLabel: 'Confirmar Assinatura',
      cancelLabel: 'Voltar'
    });
  }

  handleDialogDecision(decision: boolean): void {
    this.dialogConfig.set(null);
    if (decision && this.selectedPlan()) {
      this.subscribe(this.selectedPlan()!);
    }
    this.selectedPlan.set(null);
  }

  subscribe(plan: 'monthly' | 'yearly'): void {
    if (this.isSubscribing()) return;

    this.isSubscribing.set(true);
    this.errorMessage.set(null);
    this.toastMessage.set(null);

    this.http.post<{ message: string; newlyUnlockedMedals?: any[] }>(`${environment.apiBaseUrl}/user/upgrade-premium`, {})
      .pipe(
        take(1),
        finalize(() => this.isSubscribing.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastMessage.set(response.message || 'Seja bem-vindo ao Premium!');
          this.authFacade.refreshSession();
          
          this.routineService.forceReload();
          
          if (response.newlyUnlockedMedals && response.newlyUnlockedMedals.length > 0) {
            this.medalNotificationService.addMedals(response.newlyUnlockedMedals);
          }
          
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        },
        error: (err) => {
          const errMsg = err?.error?.detail || err?.error?.message || err?.message || 'Falha ao processar assinatura.';
          let title = 'Erro na assinatura';
          let message = errMsg;
          
          if (errMsg.toLowerCase().includes('already premium')) {
             title = 'Aviso';
             message = 'Sua conta já possui uma assinatura Premium ativa!';
          }
          
          this.selectedPlan.set(null); // Ensure plan is cleared
          this.dialogConfig.set({
             isOpen: true,
             title: title,
             message: message,
             isDestructive: false,
             showCancelButton: false,
             confirmLabel: 'OK'
          });
        }
      });
  }

  closeToast(): void {
    this.toastMessage.set(null);
  }
}

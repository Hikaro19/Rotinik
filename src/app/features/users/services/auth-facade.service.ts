import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { getHttpErrorMessage } from '@core/http/http-error.utils';
import { AuthService } from '@core/services/auth.service';
import { RoutineService } from '@core/services/routine.service';
import { ProfileService } from '@features/statistics/services/profile.service';
import { UserLoginDto, UserRegistrationDto } from '@features/users/models/user-api.models';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly routineService = inject(RoutineService);
  private readonly profileService = inject(ProfileService);

  private readonly loadingSignal = signal(false);
  private readonly errorMessageSignal = signal('');
  private readonly sessionSignal = signal(this.authService.getCurrentSession());

  readonly isLoading = this.loadingSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();
  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.token));

  login(payload: UserLoginDto): Promise<any> {
    if (this.loadingSignal()) return Promise.resolve(null);

    this.startRequest();

    return new Promise((resolve, reject) => {
      this.authService
        .login(payload)
        .pipe(finalize(() => this.loadingSignal.set(false)))
        .subscribe({
          next: (session) => {
            // 1. Salva a sessão no Facade
            this.sessionSignal.set(session);

            // 2. SINCRONIZAÇÃO FORÇADA DE ESTADO (A mágica acontece aqui)
            // Carrega os dados do usuário recém-logado nos serviços paralelos
            this.profileService.initialize();
            this.routineService.initialize();

            resolve(session);
          },
          error: (error) => {
            this.errorMessageSignal.set(
              getHttpErrorMessage(error, 'Usuario ou senha invalidos. Confira os dados e tente novamente.'),
            );
            resolve(null);
          }
        });
    });
  }

  register(payload: UserRegistrationDto): void {
    if (this.loadingSignal()) return;

    this.startRequest();

    this.authService
      .register(payload)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/auth/success']),
        error: (error) =>
          this.errorMessageSignal.set(
            getHttpErrorMessage(error, 'Nao foi possivel criar a conta. Revise os dados e tente novamente.'),
          ),
      });
  }

  logout(): void {
    this.routineService.resetState();
    this.profileService.resetProfile();
    this.authService.logout();
    this.sessionSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  clearError(): void {
    this.errorMessageSignal.set('');
  }

  refreshSession(): void {
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => {
        this.authService.updateSessionUser(user);
        this.sessionSignal.set(this.authService.getCurrentSession());
      }
    });
  }

  private startRequest(): void {
    this.errorMessageSignal.set('');
    this.loadingSignal.set(true);
  }

  deleteAccount(): Promise<{ success: boolean; message: string }> {
    if (this.loadingSignal()) return Promise.resolve({ success: false, message: 'Processando...' });

    const currentSession = this.sessionSignal();

    // Type Guard seguro usando optional chaining
    if (!currentSession?.user?.id) {
      return Promise.resolve({ success: false, message: 'Usuário não autenticado.' });
    }

    // EXTRAÇÃO SEGURA: Garantimos ao compilador que temos um número imutável aqui.
    const userId = Number(currentSession.user.id);

    this.startRequest();

    return new Promise((resolve) => {
      // Passamos a constante primitiva blindada, eliminando o erro TS18048
      this.authService.deleteAccount(userId)
        .pipe(finalize(() => this.loadingSignal.set(false)))
        .subscribe({
          next: (response) => {
            resolve({ success: true, message: response.message });
          },
          error: (error) => {
            const errorMsg = getHttpErrorMessage(error, 'Não foi possível excluir a conta.');
            this.errorMessageSignal.set(errorMsg);
            resolve({ success: false, message: errorMsg });
          }
        });
    });
  }
}

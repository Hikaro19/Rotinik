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

  login(payload: UserLoginDto): void {
    if (this.loadingSignal()) return;

    this.startRequest();

    this.authService
      .login(payload)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (session) => {
          this.sessionSignal.set(session);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) =>
          this.errorMessageSignal.set(
            getHttpErrorMessage(error, 'Usuario ou senha invalidos. Confira os dados e tente novamente.'),
          ),
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

  private startRequest(): void {
    this.errorMessageSignal.set('');
    this.loadingSignal.set(true);
  }
}

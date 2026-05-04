import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AuthService } from '@core/services/auth.service';
import { AppHttpError } from '@core/http/http-error.utils';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly formErrorMessage = signal('');

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  getFieldErrors(fieldName: string): { [key: string]: any } | null {
    const field = this.loginForm.get(fieldName);
    return field && field.touched && field.errors ? field.errors : null;
  }

  onSubmit(): void {
    this.formErrorMessage.set('');
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    this.authService.login({ Email: email, Senha: password }).subscribe({
      next: (session) => {
        console.log('[LoginComponent] Sessao autenticada:', session);
        localStorage.setItem(environment.tokenStorageKey, session.token);
        localStorage.setItem('rotinik_auth_user', JSON.stringify(session));
        this.router.navigate(['/home']);
      },
      error: (err: AppHttpError) => {
        console.error('[LoginComponent] Falha na autenticacao:', err);
        if (err.status === 401) {
          this.formErrorMessage.set('Email ou senha inválidos.');
        } else {
          this.formErrorMessage.set(err.message ?? 'Erro ao conectar com o servidor. Tente novamente.');
        }
        this.isLoading.set(false);
      },
    });
  }
}

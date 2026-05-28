import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AuthService } from '@core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

    this.authService.login({ email, password }).subscribe({
      next: () => {
        // Responsabilidade limpa: O AuthService já salvou o token. 
        // O Componente apenas cuida do fluxo visual e roteamento.
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('[LoginComponent] Falha na autenticação:', err);

        // 1. Intercepta erros de validação do C# (FluentValidation / HTTP 400)
        if (err.status === 400 && err.error?.errors) {
          const backendErrors = err.error.errors;

          Object.keys(backendErrors).forEach(key => {
            // Mapeia a chave do C# (Ex: 'Email') para o formato do Angular ('email')
            const formControl = this.loginForm.get(key.toLowerCase());
            if (formControl) {
              // Injeta o erro do backend diretamente no controle visual
              formControl.setErrors({ backend: backendErrors[key][0] });
            }
          });

          this.formErrorMessage.set('Por favor, corrija os campos destacados.');
        }
        // 2. Intercepta falha de credenciais (HTTP 401)
        else if (err.status === 401) {
          // Extrai a mensagem exata gerada pela nossa UnauthorizedException no C#
          this.formErrorMessage.set(err.error?.message || 'Email ou senha incorretos.');
        }
        // 3. Fallback para queda de servidor ou falha de rede
        else {
          this.formErrorMessage.set('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }

        this.isLoading.set(false);
      },
    });
  }
}
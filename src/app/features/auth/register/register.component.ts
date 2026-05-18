import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly formErrorMessage = signal('');

  // CONTRATO ALINHADO: Espelhando as exigências do C# e os limites do EF Core
  readonly registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    birthDate: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  goBack(): void {
    this.location.back();
  }

  getFieldErrors(fieldName: string): { [key: string]: any } | null {
    const field = this.registerForm.get(fieldName);
    return field && field.touched && field.errors ? field.errors : null;
  }

  onSubmit(): void {
    this.formErrorMessage.set('');
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    // O objeto value agora reflete perfeitamente o UserRegistrationDto do C#
    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('[RegisterComponent] Cadastro realizado:', res);
        this.router.navigate(['/auth/success']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('[RegisterComponent] Erro no cadastro:', err);

        // 1. Intercepta erros de formatação do FluentValidation (HTTP 400)
        if (err.status === 400 && err.error?.errors) {
          const backendErrors = err.error.errors;

          Object.keys(backendErrors).forEach(key => {
            // Mapeia de 'UserName' (PascalCase no C#) para 'userName' (camelCase no Angular)
            const controlName = key.charAt(0).toLowerCase() + key.slice(1);
            const formControl = this.registerForm.get(controlName);

            if (formControl) {
              formControl.setErrors({ backend: backendErrors[key][0] });
            }
          });

          this.formErrorMessage.set('Verifique os campos destacados em vermelho.');
        }
        // 2. Intercepta regras de negócio quebradas (HTTP 409 - Email/UserName em uso)
        else if (err.status === 409) {
          this.formErrorMessage.set(err.error?.message || 'Este usuário ou e-mail já está cadastrado.');

          // Se o C# mandar o campo exato (como sugerimos na ConflictException com metadados)
          if (err.error?.field) {
            const controlName = err.error.field.charAt(0).toLowerCase() + err.error.field.slice(1);
            this.registerForm.get(controlName)?.setErrors({ conflict: true });
          }
        }
        // 3. Fallback
        else {
          this.formErrorMessage.set('Erro ao conectar com o servidor. Tente novamente.');
        }

        this.isLoading.set(false);
      },
    });
  }
}
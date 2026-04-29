import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AuthService } from '@core/services/auth.service';
import { AppHttpError } from '@core/http/http-error.utils';

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

  readonly registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
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

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ nome: fullName, email, senha: password }).subscribe({
      next: () => {
        this.router.navigate(['/auth/success']);
      },
      error: (err: AppHttpError) => {
        if (err.status === 400) {
          this.formErrorMessage.set(err.message ?? 'Dados inválidos. Verifique as informações.');
        } else {
          this.formErrorMessage.set(err.message ?? 'Erro ao conectar com o servidor. Tente novamente.');
        }
        this.isLoading.set(false);
      },
    });
  }
}

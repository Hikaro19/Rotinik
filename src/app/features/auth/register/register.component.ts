import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { FormUtils } from '@shared/utils/form.utils';
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
    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: () => {
        // Auto-login flow
        this.authService.login({ email: payload.email, password: payload.password }).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/auth/success']);
          },
          error: () => {
            this.isLoading.set(false);
            this.router.navigate(['/auth/login']);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.errors) {
          FormUtils.applyBackendErrorsToForm(this.registerForm, err.error.errors);
        } else if (err.status === 409 && err.error?.field) {
          // Trata a ConflictException customizada do backend (LSP/OCP)
          const controlName = err.error.field.charAt(0).toLowerCase() + err.error.field.slice(1);
          this.registerForm.get(controlName)?.setErrors({ conflict: true });
        }

        this.formErrorMessage.set(FormUtils.extractErrorMessage(err, 'Este usuário ou e-mail já está cadastrado.'));
        this.isLoading.set(false);
      },
    });
  }
}
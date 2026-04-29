import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private recoveryTimer: ReturnType<typeof setTimeout> | null = null;

  readonly isLoading = signal(false);
  readonly isSubmitted = signal(false);
  readonly formErrorMessage = signal<string | null>(null);
  readonly forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  isButtonReady(): boolean {
    const email = this.forgotPasswordForm.controls.email.value.trim();
    return email.length > 0 && this.forgotPasswordForm.controls.email.valid;
  }

  getFieldErrors(fieldName: 'email'): string | null {
    const control = this.forgotPasswordForm.controls[fieldName];

    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'O e-mail e obrigatorio.';
    }

    if (control.errors['email']) {
      return 'Digite um e-mail valido.';
    }

    return null;
  }

  onSubmit(): void {
    this.formErrorMessage.set(null);
    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const email = this.forgotPasswordForm.controls.email.getRawValue();

    this.recoverPassword(email);
  }

  private recoverPassword(email: string): void {
    this.recoveryTimer = setTimeout(() => {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
      this.forgotPasswordForm.reset({ email });
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  }
}

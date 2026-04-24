import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

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

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      const { email, password } = this.loginForm.value;

      if (email === 'demo@rotinik.com' && password === 'password123') {
        this.router.navigate(['/home']);
      } else {
        this.formErrorMessage.set('Email ou senha invÃ¡lidos. Tente com demo@rotinik.com / password123');
        this.isLoading.set(false);
      }
    }, 1500);
  }
}

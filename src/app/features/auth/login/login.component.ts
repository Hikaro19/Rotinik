import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { FormUtils } from '@shared/utils/form.utils';
import { AuthFacadeService } from '../../users/services/auth-facade.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacadeService);
  private readonly authService = inject(AuthService);

  // Estados delegados ao Facade (DRY — não duplica lógica de loading/error)
  readonly isLoading = this.authFacade.isLoading;
  readonly formErrorMessage = this.authFacade.errorMessage;

  readonly loginForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        (control: AbstractControl) => {
          if (!control.value) return null;
          if (control.value === 'admin') return null;
          return Validators.email(control);
        },
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  getFieldErrors(fieldName: string): { [key: string]: any } | null {
    const field = this.loginForm.get(fieldName);
    return field && field.touched && field.errors ? field.errors : null;
  }

  onSubmit(): void {
    this.authFacade.clearError();
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.isLoading()) return;

    const { email, password } = this.loginForm.value;
    this.authFacade.login({ email, password });
  }
}
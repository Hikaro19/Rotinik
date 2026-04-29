import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacadeService } from '@core/services/auth-facade.service';
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
  private readonly authFacade = inject(AuthFacadeService);

  readonly isLoading = this.authFacade.isLoading;
  readonly formErrorMessage = this.authFacade.errorMessage;
  readonly loginForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required]],
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

    if (this.loginForm.invalid) {
      return;
    }

    const { userName, password } = this.loginForm.getRawValue();
    this.authFacade.login({ userName, password });
  }
}

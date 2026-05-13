import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '@core/services/auth-facade.service';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly authFacade = inject(AuthFacadeService);

  readonly isLoading = this.authFacade.isLoading;
  readonly formErrorMessage = this.authFacade.errorMessage;

  readonly registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
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
    this.authFacade.clearError();
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    const { fullName, birthDate, userName, password, email } = this.registerForm.getRawValue();

    this.authFacade.register({
      name: fullName,
      birthDate,
      userName,
      password,
      email,
    });
  }
}

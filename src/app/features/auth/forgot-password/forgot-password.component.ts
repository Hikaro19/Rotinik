import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppButtonComponent, AppInputComponent } from '@app/shared/components/ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  // Signals para gerenciar o estado da UI de forma reativa e performática
  isLoading = signal(false);
  isSuccess = signal(false);
  formErrorMessage = signal<string | null>(null);

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Helper para capturar erros de validação (usado no [errors] do HTML)
  getFieldErrors(fieldName: string): string[] | null {
    const control = this.forgotPasswordForm.get(fieldName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return ['O e-mail é obrigatório'];
      if (control.errors?.['email']) return ['Insira um e-mail válido'];
    }
    return null;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.formErrorMessage.set(null);
    this.isSuccess.set(false);

    // Simulando uma chamada ao serviço de autenticação
    setTimeout(() => {
      const email = this.forgotPasswordForm.value.email;

      // Aqui entraria a lógica do seu AuthService.sendPasswordReset(email)
      if (email === 'erro@teste.com') { // Simulação de erro
        this.formErrorMessage.set('Este e-mail não foi encontrado em nossa base.');
        this.isLoading.set(false);
      } else {
        // Sucesso
        this.isSuccess.set(true);
        this.isLoading.set(false);
        this.forgotPasswordForm.reset();
      }
    }, 2000);
  }
}

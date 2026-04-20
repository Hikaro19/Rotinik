import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador customizado para força de senha
 * Requer: números, letras maiúsculas, minúsculas, e símbolos
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumericValue = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumericValue && hasSpecialChar;

    if (!passwordValid) {
      return {
        weakPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumericValue,
          hasSpecialChar,
        },
      };
    }

    return null;
  };
}

/**
 * Validador para verificar que as senhas correspondem
 * Use em um FormGroup, não em um FormControl
 */
export function passwordMatchValidator(passwordField: string = 'password', confirmField: string = 'confirmPassword'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmField);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  };
}

/**
 * Validador para email
 * Mais rigoroso que o email validator padrão
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email) ? null : { invalidEmail: true };
  };
}

/**
 * Validador para nome de usuário
 * Apenas letras, números, underscore e hífen
 */
export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;

    if (!username) {
      return null;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    return usernameRegex.test(username) ? null : { invalidUsername: true };
  };
}

/**
 * Validador para URL
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const url = control.value;

    if (!url) {
      return null;
    }

    try {
      new URL(url);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}

/**
 * Validador para número de telefone (formato básico)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phone = control.value;

    if (!phone) {
      return null;
    }

    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');

    // Verifica se tem entre 10 e 15 dígitos
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return { invalidPhone: true };
    }

    return null;
  };
}

/**
 * Validador assíncrono para verificar disponibilidade de email
 * Simula uma chamada ao backend
 */
export function emailAvailabilityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null;
    }

    // Simulação: emails reservados não disponíveis
    const reservedEmails = ['admin@rotinik.com', 'support@rotinik.com'];

    if (reservedEmails.includes(email.toLowerCase())) {
      return { emailNotAvailable: true };
    }

    return null;
  };
}

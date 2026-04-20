import { Component, Input, Output, EventEmitter, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormGroup } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="app-input-wrapper">
      <!-- Label -->
      <label *ngIf="label" [for]="inputId" class="app-input-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>

      <!-- Input Container com ícone-->
      <div class="app-input-container" [class.app-input-container--has-icon]="!!icon">
        <!-- Ícone esquerdo (opcional) -->
        <span *ngIf="icon" class="app-input-icon">
          <ng-content select="[appInputIcon]"></ng-content>
        </span>

        <!-- Input -->
        <input
          #inputElement
          [id]="inputId"
          [class]="inputClasses()"
          [type]="isPasswordVisible() ? 'text' : inputType"
          [placeholder]="placeholder"
          [value]="value()"
          [disabled]="disabled"
          [required]="required"
          [attr.autocomplete]="autocomplete"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-invalid]="hasError()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (change)="onInputChange()"
        />

        <!-- Botão show/hide para password -->
        <button
          *ngIf="inputType === 'password'"
          type="button"
          class="app-input-password-toggle"
          [attr.aria-label]="isPasswordVisible() ? 'Ocultar senha' : 'Mostrar senha'"
          (click)="togglePasswordVisibility()"
          [disabled]="disabled"
        >
          <svg
            class="eye-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path *ngIf="!isPasswordVisible" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle *ngIf="!isPasswordVisible" cx="12" cy="12" r="3" />
            <path
              *ngIf="isPasswordVisible"
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            />
            <line *ngIf="isPasswordVisible" x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </button>

        <!-- Contador de caracteres -->
        <span *ngIf="maxLength && showCharCount" class="app-input-char-count">
          {{ value().length }} / {{ maxLength }}
        </span>
      </div>

      <!-- Erro de validação -->
      <div *ngIf="hasError()" class="app-input-error" role="alert">
        {{ errorMessage() }}
      </div>

      <!-- Texto de ajuda -->
      <p *ngIf="helpText && !hasError()" class="app-input-help">
        {{ helpText }}
      </p>
    </div>
  `,
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() inputType: InputType = 'text';
  @Input() icon = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() autocomplete?: string;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;
  @Input() helpText?: string;
  @Input() showCharCount = false;
  @Input() ariaLabel?: string;
  @Input() errors?: { [key: string]: any };

  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() change = new EventEmitter<string>();

  // Signals
  value = signal('');
  isFocused = signal(false);
  isPasswordVisible = signal(false);
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  // Computed
  hasError = computed(() => {
    return this.errors && Object.keys(this.errors).length > 0;
  });

  errorMessage = computed(() => {
    if (!this.errors) return '';

    const errorKeys = Object.keys(this.errors);
    if (errorKeys.length === 0) return '';

    const firstError = errorKeys[0];
    const errorValue = this.errors[firstError];

    // Mensagens de erro customizadas
    switch (firstError) {
      case 'required':
        return `${this.label || 'Campo'} é obrigatório`;
      case 'email':
        return 'Email inválido';
      case 'minlength':
        return `Mínimo de ${errorValue.requiredLength} caracteres`;
      case 'maxlength':
        return `Máximo de ${errorValue.requiredLength} caracteres`;
      case 'pattern':
        return 'Formato inválido';
      default:
        return 'Campo inválido';
    }
  });

  inputClasses = computed(() => {
    const base = 'app-input';
    const focusClass = this.isFocused() ? 'app-input--focused' : '';
    const errorClass = this.hasError() ? 'app-input--error' : '';
    const disabledClass = this.disabled ? 'app-input--disabled' : '';

    return [base, focusClass, errorClass, disabledClass].filter(Boolean).join(' ');
  });

  // ControlValueAccessor methods
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value.set(obj || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let inputValue = target.value;

    // Validar maxLength
    if (this.maxLength && inputValue.length > this.maxLength) {
      inputValue = inputValue.slice(0, this.maxLength);
    }

    this.value.set(inputValue);
    this.onChange(inputValue);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focus.emit();
  }

  onInputChange(): void {
    this.change.emit(this.value());
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((prev) => !prev);
  }
}

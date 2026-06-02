import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EFrequencia } from '../models/rotina.enum';
import { RoutinesFacadeService } from '../services/routines-facade.service';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-routine-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent],
  templateUrl: './routine-create.component.html',
  styleUrl: './routine-create.component.scss',
})
export class RoutineCreateComponent {
  private fb = inject(FormBuilder);
  private routinesFacade = inject(RoutinesFacadeService);

  readonly routineCreated = output<string>();
  readonly cancelled = output<void>();

  private readonly isSubmittingLocal = signal(false);

  readonly isSaving = this.routinesFacade.createPending;
  readonly submitError = signal<string | null>(null);

  readonly frequencias = [
    { label: 'Diaria', value: EFrequencia.DIARIA },
    { label: 'Semanal', value: EFrequencia.SEMANAL },
    { label: 'Mensal', value: EFrequencia.MENSAL },
  ];
  readonly categorias = ['Saude', 'Estudos', 'Trabalho', 'Casa', 'Social', 'Mindfulness', 'Lazer', 'Leitura'];

  readonly createForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Saude', Validators.required],
    meta: ['', [Validators.required, Validators.minLength(5)]],
    prazo: [EFrequencia.DIARIA, Validators.required],
  });

  constructor() {
    effect(() => {
      const isSaving = this.isSaving();
      const error = this.routinesFacade.errorMessage();
      const isSubmitting = this.isSubmittingLocal();

      if (!isSubmitting) return;

      if (isSaving) return;

      if (error) {
        this.submitError.set(error);
        this.isSubmittingLocal.set(false);
        return;
      }

      const nomeRotina = this.createForm.getRawValue().nome;
      this.routineCreated.emit(nomeRotina);
      this.isSubmittingLocal.set(false);
      this.resetForm();
    }, { allowSignalWrites: true });
  }

  get nomeControl() { return this.createForm.controls.nome; }
  get categoriaControl() { return this.createForm.controls.categoria; }
  get metaControl() { return this.createForm.controls.meta; }
  get prazoControl() { return this.createForm.controls.prazo; }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.isSaving()) {
      this.onCancel();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isSaving()) {
      this.onCancel();
    }
  }

  onSaveRoutine(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitError.set(null);
    this.routinesFacade.clearError();
    this.isSubmittingLocal.set(true);

    try {
      const formValue = this.createForm.getRawValue();
      const payload = {
        title: formValue.nome,
        category: formValue.categoria,
        description: formValue.meta,
        frequency: formValue.prazo.toString()
      };

      this.routinesFacade.createRoutine(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível criar a rotina.';
      this.submitError.set(message);
      this.isSubmittingLocal.set(false);
    }
  }

  onCancel(): void {
    if (this.isSaving()) {
      return;
    }

    this.isSubmittingLocal.set(false);
    this.resetForm();
    this.submitError.set(null);
    this.routinesFacade.clearError();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.createForm.reset({
      nome: '',
      categoria: 'Saude',
      meta: '',
      prazo: EFrequencia.DIARIA,
    });
    this.createForm.markAsPristine();
    this.createForm.markAsUntouched();
  }
}
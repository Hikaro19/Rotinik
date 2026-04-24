import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EFrequencia, Rotina } from '@core/models/domain';
import { RoutinesFacadeService } from '@core/services/routines-facade.service';
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

  readonly routineCreated = output<Rotina>();
  readonly cancelled = output<void>();

  private readonly pendingCreatedRoutine = signal<Rotina | null>(null);
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
      const pendingRoutine = this.pendingCreatedRoutine();
      const isSaving = this.isSaving();
      const error = this.routinesFacade.errorMessage();

      if (!pendingRoutine || isSaving) {
        return;
      }

      if (error) {
        this.submitError.set(error);
        return;
      }

      this.routineCreated.emit(pendingRoutine);
      this.pendingCreatedRoutine.set(null);
      this.resetForm();
    });
  }

  get nomeControl() {
    return this.createForm.controls.nome;
  }

  get categoriaControl() {
    return this.createForm.controls.categoria;
  }

  get metaControl() {
    return this.createForm.controls.meta;
  }

  get prazoControl() {
    return this.createForm.controls.prazo;
  }

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

    try {
      const { nome, categoria, meta, prazo } = this.createForm.getRawValue();
      const novaRotina = new Rotina(nome, categoria, meta, prazo);
      this.pendingCreatedRoutine.set(novaRotina);
      this.routinesFacade.createRoutine(novaRotina);

      if (!this.isSaving()) {
        this.routineCreated.emit(novaRotina);
        this.pendingCreatedRoutine.set(null);
        this.resetForm();
      }
    } catch (error) {
      this.pendingCreatedRoutine.set(null);
      const message = error instanceof Error ? error.message : 'Nao foi possivel criar a rotina.';
      this.submitError.set(message);
    }
  }

  onCancel(): void {
    if (this.isSaving()) {
      return;
    }

    this.pendingCreatedRoutine.set(null);
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

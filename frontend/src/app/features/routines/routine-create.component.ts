import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EFrequencia, Rotina } from '@core/models/domain';
import { RoutineService } from '@core/services/routine.service';
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
  private routineService = inject(RoutineService);

  readonly routineCreated = output<Rotina>();
  readonly cancelled = output<void>();

  readonly isSaving = signal(false);
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

    this.isSaving.set(true);
    this.submitError.set(null);

    try {
      const { nome, categoria, meta, prazo } = this.createForm.getRawValue();
      const novaRotina = new Rotina(nome, categoria, meta, prazo);
      this.routineService.adicionarRotina(novaRotina);
      this.routineCreated.emit(novaRotina);
      this.resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel criar a rotina.';
      this.submitError.set(message);
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.resetForm();
    this.submitError.set(null);
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

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutineViewModel } from '@core/models/view/routine-view.models';
import { EFrequencia } from '@core/models/domain';

export interface RoutineFormValue {
  title: string;
  description?: string;
  category: string;
  frequency: string;
}

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() routine: RoutineViewModel | null | undefined = null;
  @Input() submitting = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<RoutineFormValue>();

  readonly frequencias = [
    { label: 'Diária', value: EFrequencia.DIARIA.toString() },
    { label: 'Semanal', value: EFrequencia.SEMANAL.toString() },
    { label: 'Mensal', value: EFrequencia.MENSAL.toString() },
  ];
  
  readonly categorias = ['Saude', 'Estudos', 'Trabalho', 'Casa', 'Social', 'Mindfulness', 'Lazer', 'Leitura', 'Geral'];

  readonly routineForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: ['saude', Validators.required],
    frequency: [EFrequencia.DIARIA.toString(), Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routine']) {
      this.populateForm();
    }
  }

  onSubmit(): void {
    this.routineForm.markAllAsTouched();
    
    if (this.routineForm.invalid || this.submitting) {
      return;
    }

    const { title, description, category, frequency } = this.routineForm.getRawValue();
    this.save.emit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
    });
  }

  onCancel(): void {
    this.fecharModal();
  }

  fecharModal(): void {
    if (this.submitting) {
      return;
    }

    this.cancel.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.fecharModal();
  }

  private populateForm(): void {
    if (!this.routine) {
      this.routineForm.reset({
        title: '',
        description: '',
        category: 'saude',
        frequency: EFrequencia.DIARIA.toString(),
      });
      return;
    }

    // Map string from RoutineViewModel to EFrequencia string value for the select
    let freqValue = EFrequencia.DIARIA.toString();
    if (this.routine.frequency === 'weekly') freqValue = EFrequencia.SEMANAL.toString();
    if (this.routine.frequency === 'monthly') freqValue = EFrequencia.MENSAL.toString();

    this.routineForm.reset({
      title: this.routine.title,
      description: this.routine.description ?? '',
      category: this.routine.category?.toLowerCase() ?? 'geral',
      frequency: freqValue,
    });
  }
}

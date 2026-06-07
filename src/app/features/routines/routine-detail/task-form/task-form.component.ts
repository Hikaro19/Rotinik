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
import { TaskImportance } from '../../models/routine-api.models';
import { TaskViewModel } from '../../models/routine-view.models';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';

export interface TaskFormValue {
  routineId: string;
  title: string;
  description?: string;
  importance: TaskImportance;
  deadlineValue?: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})

export class TaskFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) routineId = '';
  @Input() task: TaskViewModel | null = null;
  @Input({ required: true }) routineFrequency: string = 'daily';
  @Input() submitting = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskFormValue>();

  // A propriedade dotClass foi removida pois o SCSS agora controla a cor dos pontos
  readonly importanceOptions: Array<{
    value: TaskImportance;
    label: string;
  }> = [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Média' },
      { value: 'alta', label: 'Alta' },
      { value: 'critica', label: 'Crítica' },
    ];

  readonly taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    importance: ['media' as TaskImportance, Validators.required],
    deadlineValue: [''],
  });

  // Opções para rotinas semanais
  readonly daysOfWeek = [
    { value: 'Domingo', label: 'Domingo' },
    { value: 'Segunda-feira', label: 'Segunda-feira' },
    { value: 'Terça-feira', label: 'Terça-feira' },
    { value: 'Quarta-feira', label: 'Quarta-feira' },
    { value: 'Quinta-feira', label: 'Quinta-feira' },
    { value: 'Sexta-feira', label: 'Sexta-feira' },
    { value: 'Sábado', label: 'Sábado' },
  ];

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get maxDate(): string {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  }

  get normalizedFrequency(): string {
    return this.routineFrequency?.toLowerCase()?.trim() || 'diaria';
  }

  get isEditMode(): boolean {
    return !!this.task;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.populateForm();
    }
  }

  onSubmit(): void {
    this.taskForm.markAllAsTouched();

    // Blindagem de segurança contra rotas nulas
    if (this.taskForm.invalid || this.submitting || !this.routineId || !this.routineId.trim()) {
      return;
    }

    const { title, description, importance, deadlineValue } = this.taskForm.getRawValue();
    this.save.emit({
      routineId: this.routineId,
      title: title.trim(),
      description: description.trim() || undefined,
      importance,
      deadlineValue,
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

  // Gera APENAS as classes lógicas. O estilo real vive no arquivo SCSS.
  getImportanceClass(option: TaskImportance): string {
    const isSelected = this.taskForm.controls.importance.value === option;
    return isSelected ? `pill-active ${option}` : '';
  }

  private populateForm(): void {
    if (!this.task) {
      this.taskForm.reset({
        title: '',
        description: '',
        importance: 'media',
        deadlineValue: '',
      });
      return;
    }

    this.taskForm.reset({
      title: this.task.title,
      description: this.task.description ?? '',
      importance: this.task.importance ?? 'media',
      deadlineValue: this.task.deadlineValue ?? '',
    });
  }
}
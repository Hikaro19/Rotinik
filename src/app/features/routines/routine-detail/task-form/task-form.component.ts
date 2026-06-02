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

export interface TaskFormValue {
  routineId: string;
  title: string;
  description?: string;
  importance: TaskImportance;
  estimatedMinutes: number;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) routineId = '';
  @Input() task: TaskViewModel | null = null;
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
    estimatedMinutes: [30, [Validators.required, Validators.min(5)]],
  });

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

    const { title, description, importance, estimatedMinutes } = this.taskForm.getRawValue();
    this.save.emit({
      routineId: this.routineId,
      title: title.trim(),
      description: description.trim() || undefined,
      importance,
      estimatedMinutes,
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
        estimatedMinutes: 30,
      });
      return;
    }

    this.taskForm.reset({
      title: this.task.title,
      description: this.task.description ?? '',
      importance: this.task.importance ?? 'media',
      estimatedMinutes: this.task.estimatedMinutes ?? 30,
    });
  }
}
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

  readonly templates = this.routinesFacade.templates;
  readonly selectedTemplateId = signal<string | null>(null);

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

      // We only emit routineCreated when not using a template, 
      // because template cloning is handled manually in onSaveRoutine.
      // Actually, if we just use createRoutine, this effect triggers.
      // We will handle the emit manually below.
    }, { allowSignalWrites: true });
  }

  get nomeControl() { return this.createForm.controls.nome; }
  get categoriaControl() { return this.createForm.controls.categoria; }
  get metaControl() { return this.createForm.controls.meta; }
  get prazoControl() { return this.createForm.controls.prazo; }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.isSaving() && !this.isSubmittingLocal()) {
      this.onCancel();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isSaving() && !this.isSubmittingLocal()) {
      this.onCancel();
    }
  }

  onTemplateSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const templateId = select.value;
    
    if (!templateId) {
      this.selectedTemplateId.set(null);
      this.resetForm();
      return;
    }

    this.selectedTemplateId.set(templateId);
    const template = this.templates().find(t => t.id === templateId);
    
    if (template) {
      this.createForm.patchValue({
        nome: template.title,
        categoria: template.category,
        meta: template.description,
        prazo: template.frequency as EFrequencia
      });
      this.createForm.markAsDirty();
    }
  }

  onSaveRoutine(): void {
    if (this.isSubmittingLocal() || this.isSaving()) return;

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitError.set(null);
    this.routinesFacade.clearError();
    this.isSubmittingLocal.set(true);

    const formValue = this.createForm.getRawValue();
    const payload = {
      title: formValue.nome,
      category: formValue.categoria,
      description: formValue.meta,
      frequency: formValue.prazo.toString()
    };

    const templateId = this.selectedTemplateId();

    if (templateId) {
      // 1. Clone the template
      this.routinesFacade.cloneTemplate(templateId).subscribe({
        next: (cloned) => {
          // 2. Update with the customized details
          this.routinesFacade.updateRoutineDirect(cloned.id.toString(), payload).subscribe({
            next: () => {
              this.routinesFacade.loadSnapshot();
              this.routineCreated.emit(formValue.nome);
              this.isSubmittingLocal.set(false);
              this.resetForm();
            },
            error: (err) => {
              this.submitError.set('Erro ao aplicar personalizações na rotina.');
              this.isSubmittingLocal.set(false);
            }
          });
        },
        error: (err) => {
          this.submitError.set('Erro ao clonar o modelo pré-fabricado.');
          this.isSubmittingLocal.set(false);
        }
      });
    } else {
      // Create from scratch
      this.routinesFacade.createRoutine(payload);
      
      // Wait for facade state to settle then emit
      setTimeout(() => {
        if (!this.routinesFacade.errorMessage()) {
          this.routineCreated.emit(formValue.nome);
          this.isSubmittingLocal.set(false);
          this.resetForm();
        }
      }, 500);
    }
  }

  onCancel(): void {
    if (this.isSaving() || this.isSubmittingLocal()) {
      return;
    }

    this.isSubmittingLocal.set(false);
    this.resetForm();
    this.submitError.set(null);
    this.routinesFacade.clearError();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.selectedTemplateId.set(null);
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
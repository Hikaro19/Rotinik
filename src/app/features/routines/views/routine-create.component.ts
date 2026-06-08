import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EFrequencia } from '../models/rotina.enum';
import { RoutinesFacadeService } from '../services/routines-facade.service';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-routine-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent, ConfirmDialogComponent],
  templateUrl: './routine-create.component.html',
  styleUrl: './routine-create.component.scss',
})
export class RoutineCreateComponent {
  private fb = inject(FormBuilder);
  private routinesFacade = inject(RoutinesFacadeService);
  private router = inject(Router);

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

  readonly showPremiumPrompt = signal<boolean>(false);

  onSaveRoutine(): void {
    if (this.isSubmittingLocal() || this.isSaving()) return;

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitError.set(null);
    this.showPremiumPrompt.set(false);
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
              this.handleError(err, 'Erro ao aplicar personalizações na rotina.');
            }
          });
        },
        error: (err) => {
          this.handleError(err, 'Erro ao clonar o modelo pré-fabricado.');
        }
      });
    } else {
      // Create from scratch
      this.routinesFacade.createRoutine(payload);
      
      // Wait for facade state to settle then emit
      setTimeout(() => {
        const facadeError = this.routinesFacade.errorMessage();
        if (!facadeError) {
          this.routineCreated.emit(formValue.nome);
          this.isSubmittingLocal.set(false);
          this.resetForm();
        } else {
          this.handleError({ message: facadeError }, facadeError);
        }
      }, 500);
    }
  }

  private handleError(err: any, fallbackMessage: string): void {
    let errorMessage = err?.error?.detail || err?.error?.title || err?.message || fallbackMessage;
    if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('limit reached')) {
      if (errorMessage.toLowerCase().includes('upgrade to premium')) {
        this.showPremiumPrompt.set(true);
        this.submitError.set('Você atingiu o limite de rotinas da sua conta atual!');
      } else {
        this.submitError.set('Você já atingiu o limite máximo de rotinas permitido pelo plano Premium (15 rotinas)!');
      }
    } else {
      this.submitError.set(errorMessage);
    }
    this.isSubmittingLocal.set(false);
  }

  onBuyPremium(): void {
    this.showPremiumPrompt.set(false);
    this.onCancel();
    this.router.navigate(['/premium']);
  }

  onCancelPrompt(): void {
    this.showPremiumPrompt.set(false);
  }

  onCancel(): void {
    if (this.isSaving() || this.isSubmittingLocal()) {
      return;
    }

    this.isSubmittingLocal.set(false);
    this.showPremiumPrompt.set(false);
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
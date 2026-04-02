import { Component, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RotatinaRepository } from '@core/services/rotinaRepository.service';
import { Rotina, EFrequencia } from '@core/models/domain';
import { AppModalComponent } from '@shared/components/ui/modal/modal.component';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';

/**
 * 🎯 RoutineCreateComponent
 * Modal para criar nova rotina
 * Implementa OOP + ReactiveForms
 */
@Component({
  selector: 'app-routine-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppModalComponent,
    AppCardComponent,
    AppButtonComponent,
    AppInputComponent,
    AppToastComponent,
  ],
  template: `
    <app-modal
      #modal
      title="Criar Nova Rotina"
      size="md"
      [closeable]="!isLoading()"
      [closeOnBackdrop]="!isLoading()"
      primaryActionLabel="Salvar Rotina"
      secondaryActionLabel="Cancelar"
      (primaryAction)="onSaveRoutine()"
      (secondaryAction)="onCancel()"
      (onClose)="onCancel()"
    >
      <!-- Form Container -->
      <div class="routine-create-form">
        <form [formGroup]="createForm">
          <!-- Nome da Rotina -->
          <div class="form-group">
            <app-input
              label="Nome da Rotina"
              placeholder="Ex: Exercício Matinal"
              formControlName="titulo"
              [required]="true"
              [disabled]="isLoading()"
              helpText="Mínimo 3 caracteres"
            ></app-input>
          </div>

          <!-- Descrição (Meta) -->
          <div class="form-group">
            <app-input
              label="Meta / Descrição"
              placeholder="Ex: Treino de 30 minutos com foco em resistência"
              formControlName="descricao"
              [required]="true"
              [disabled]="isLoading()"
              helpText="Descreva brevemente o objetivo"
            ></app-input>
          </div>

          <!-- Frequência -->
          <div class="form-group">
            <label class="form-label">Frequência</label>
            <div class="frequency-selector">
              <button
                type="button"
                class="frequency-btn"
                [class.active]="createForm.get('frequencia')?.value === frequenciaOptions.DIARIA"
                (click)="setFrequencia(frequenciaOptions.DIARIA)"
                [disabled]="isLoading()"
              >
                📅 Diária
              </button>
              <button
                type="button"
                class="frequency-btn"
                [class.active]="createForm.get('frequencia')?.value === frequenciaOptions.SEMANAL"
                (click)="setFrequencia(frequenciaOptions.SEMANAL)"
                [disabled]="isLoading()"
              >
                📆 Semanal
              </button>
              <button
                type="button"
                class="frequency-btn"
                [class.active]="createForm.get('frequencia')?.value === frequenciaOptions.MENSAL"
                (click)="setFrequencia(frequenciaOptions.MENSAL)"
                [disabled]="isLoading()"
              >
                📋 Mensal
              </button>
            </div>
          </div>

          <!-- Validação Global -->
          <div *ngIf="createForm.invalid && createForm.touched" class="form-error">
            ⚠️ Preencha todos os campos corretamente
          </div>
        </form>
      </div>

      <!-- Toast de Sucesso (opcional, pode ser global) -->
      <app-toast
        *ngIf="showSuccessToast()"
        type="success"
        title="Sucesso!"
        message="Rotina criada com sucesso 🎉"
        [duration]="3000"
        (onClose)="showSuccessToast.set(false)"
      ></app-toast>
    </app-modal>
  `,
  styleUrl: './routine-create.component.scss',
})
export class RoutineCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private repository = inject(RotatinaRepository);

  // Outputs
  routineCreated = output<Rotina>();
  cancelled = output<void>();

  // Signals
  isLoading = signal(false);
  showSuccessToast = signal(false);

  // Form
  createForm!: FormGroup;

  // Enums accessibles in template
  frequenciaOptions = EFrequencia;

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * 🎨 Inicializa o formulário com validações
   */
  private initializeForm(): void {
    this.createForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required]],
      frequencia: [EFrequencia.DIARIA, Validators.required],
    });
  }

  /**
   * 🎯 Define a frequência selecionada
   */
  setFrequencia(frequencia: EFrequencia): void {
    this.createForm.patchValue({ frequencia });
  }

  /**
   * 💾 Salva a rotina (Instancia classe Rotina + valida regras de negócio)
   */
  onSaveRoutine(): void {
    // Validação básica do formulário
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      // ─────────────────────────────────────────────────────────
      // 🎯 REGRA DE OURO: Usar o Repositório para instanciar + persistir
      // A classe Rotina está encapsulada no repositório
      // ─────────────────────────────────────────────────────────
      const { titulo, descricao, frequencia } = this.createForm.value;

      // Chamar o repositório (que já valida e gerencia a classe Rotina)
      const novaRotina = this.repository.criarRotina(titulo, descricao, frequencia);

      // Feedback visual
      this.showSuccessToast.set(true);

      // Emitir saída
      this.routineCreated.emit(novaRotina);

      // Fechar modal
      setTimeout(() => {
        this.onCancel();
      }, 1500);
    } catch (error) {
      console.error('❌ Erro ao criar rotina:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * ❌ Cancela e fecha o modal
   */
  onCancel(): void {
    this.createForm.reset();
    this.cancelled.emit();
  }
}


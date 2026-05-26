import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CreateTaskRequestDto } from '@core/models/api';
import { RoutineApiService } from '@core/services/routine-api.service';
import { RoutineService, Task } from '@core/services/routine.service';
import { RoutineDetailFacadeService } from '@core/services/routine-detail-facade.service';
import { TaskFormComponent, TaskFormValue } from './task-form/task-form.component';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, AppToastComponent, ConfirmDialogComponent],
  templateUrl: './routine-detail.component.html',
  styleUrl: './routine-detail.component.scss',
})
export class RoutineDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routineApi = inject(RoutineApiService);
  private readonly routineService = inject(RoutineService);
  private readonly routineDetailFacade = inject(RoutineDetailFacadeService);

  readonly routineId = this.routineDetailFacade.routineId;
  readonly rotinaAtual = this.routineDetailFacade.rotinaAtual;
  readonly loading = this.routineDetailFacade.loading;
  readonly rotneName = this.routineDetailFacade.rotineName;
  readonly rotineDescription = this.routineDetailFacade.rotineDescription;
  readonly rotineIcon = this.routineDetailFacade.rotineIcon;
  readonly frequency = this.routineDetailFacade.frequency;
  readonly allTasks = this.routineDetailFacade.allTasks;
  readonly tarefasIniciais = this.routineDetailFacade.tarefasIniciais;
  readonly tarefasRestante = this.routineDetailFacade.tarefasRestante;
  readonly progresso = this.routineDetailFacade.progresso;
  readonly totalTarefas = this.routineDetailFacade.totalTarefas;
  readonly tarefasCompletas = this.routineDetailFacade.tarefasCompletas;
  readonly seqenciaCompletamento = this.routineDetailFacade.seqenciaCompletamento;
  readonly xpTotal = this.routineDetailFacade.xpTotal;
  readonly moedasTotal = this.routineDetailFacade.moedasTotal;
  readonly rotinaCompleta = this.routineDetailFacade.rotinaCompleta;
  readonly nomeUsuario = this.routineDetailFacade.nomeUsuario;
  readonly nivelUsuario = this.routineDetailFacade.nivelUsuario;
  readonly moedasUsuario = this.routineDetailFacade.moedasUsuario;
  readonly isBusy = this.routineDetailFacade.isBusy;
  readonly isCompletingTask = this.routineDetailFacade.isCompletingTask;
  readonly isUpdatingTask = this.routineDetailFacade.isUpdatingTask;
  readonly isDeletingTask = this.routineDetailFacade.isDeletingTask;
  readonly errorMessage = this.routineDetailFacade.errorMessage;
  readonly completedTasks = computed(() => this.allTasks().filter((task) => task.completed));

  readonly isTaskFormOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);
  readonly isSubmittingTaskForm = signal(false);
  readonly isDeleteTaskDialogOpen = signal(false);
  readonly taskPendingDeletion = signal<Task | null>(null);
  readonly isDeletingTaskRequest = signal(false);
  readonly isDeleteRoutineDialogOpen = signal(false);
  readonly isDeletingRoutine = signal(false);
  readonly toastMessage = signal<string | null>(null);
  readonly localErrorMessage = signal<string | null>(null);
  readonly taskActionBusy = computed(
    () => this.isCompletingTask() || this.isSubmittingTaskForm() || this.isDeletingTaskRequest()
  );
  readonly displayErrorMessage = computed(() => this.localErrorMessage() ?? this.errorMessage());

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'] as string;
      this.routineDetailFacade.loadRoutine(id);
    });
  }

  completeTask(taskId: string): void {
    this.routineDetailFacade.completeTask(taskId);
  }

  uncompleteTask(taskId: string): void {
    this.routineDetailFacade.uncompleteTask(taskId);
  }

  deleteTask(taskId: string): void {
    const task = this.allTasks().find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    this.taskPendingDeletion.set(task);
    this.isDeleteTaskDialogOpen.set(true);
  }

  clearError(): void {
    this.routineDetailFacade.clearError();
    this.localErrorMessage.set(null);
  }

  openCreateTask(): void {
    this.selectedTask.set(null);
    this.isTaskFormOpen.set(true);
  }

  openEditTask(task: Task): void {
    this.selectedTask.set(task);
    this.isTaskFormOpen.set(true);
  }

  closeTaskForm(): void {
    this.isTaskFormOpen.set(false);
    this.selectedTask.set(null);
  }

  submitTaskForm(payload: TaskFormValue): void {
    const routineId = payload.routineId || this.routineId();
    if (!routineId) {
      return;
    }

    this.localErrorMessage.set(null);
    this.isSubmittingTaskForm.set(true);
    const editingTask = this.selectedTask();
    const apiPayload = this.buildTaskApiPayload(payload);

    const request$ = editingTask
      ? this.routineApi.updateTask(routineId, editingTask.id, apiPayload)
      : this.routineApi.addTask(routineId, apiPayload);

    request$.pipe(take(1)).subscribe({
      next: (updatedRoutine) => {
        this.routineService.syncRoutineFromApi(updatedRoutine);
        this.routineDetailFacade.refreshRoutine();
        this.isSubmittingTaskForm.set(false);
        this.closeTaskForm();
        this.toastMessage.set(editingTask ? 'Tarefa atualizada.' : 'Tarefa criada.');
      },
      error: () => {
        this.isSubmittingTaskForm.set(false);
        this.localErrorMessage.set('Não foi possível salvar a tarefa.');
      },
    });
  }

  confirmDeleteTask(confirmed: boolean): void {
    if (!confirmed) {
      this.isDeleteTaskDialogOpen.set(false);
      this.taskPendingDeletion.set(null);
      return;
    }

    const routineId = this.routineId();
    const task = this.taskPendingDeletion();
    if (!routineId || !task) {
      return;
    }

    this.localErrorMessage.set(null);
    this.isDeletingTaskRequest.set(true);
    this.routineApi
      .deleteTask(routineId, task.id)
      .pipe(take(1))
      .subscribe({
        next: (updatedRoutine) => {
          this.routineService.syncRoutineFromApi(updatedRoutine);
          this.routineDetailFacade.refreshRoutine();
          this.toastMessage.set('Tarefa excluída.');
          this.isDeletingTaskRequest.set(false);
          this.isDeleteTaskDialogOpen.set(false);
          this.taskPendingDeletion.set(null);
        },
        error: () => {
          this.isDeletingTaskRequest.set(false);
          this.localErrorMessage.set('Não foi possível excluir a tarefa.');
          this.isDeleteTaskDialogOpen.set(false);
          this.taskPendingDeletion.set(null);
        },
      });
  }

  openDeleteRoutineDialog(): void {
    this.isDeleteRoutineDialogOpen.set(true);
  }

  confirmDeleteRoutine(confirmed: boolean): void {
    if (!confirmed) {
      this.isDeleteRoutineDialogOpen.set(false);
      return;
    }

    const routineId = this.routineId();
    if (!routineId) {
      return;
    }

    this.localErrorMessage.set(null);
    this.isDeletingRoutine.set(true);
    this.routineApi
      .delete(routineId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.routineService.removeRoutineFromState(routineId);
          this.isDeletingRoutine.set(false);
          this.isDeleteRoutineDialogOpen.set(false);
          this.router.navigate(['/routines']);
        },
        error: () => {
          this.isDeletingRoutine.set(false);
          this.localErrorMessage.set('Não foi possível excluir a rotina.');
          this.isDeleteRoutineDialogOpen.set(false);
        },
      });
  }

  closeToast(): void {
    this.toastMessage.set(null);
  }

  getDeleteTaskMessage(): string {
    const taskTitle = this.taskPendingDeletion()?.title ?? 'esta tarefa';
    return `Tem certeza que deseja excluir a tarefa "${taskTitle}"?`;
  }

  getImportanceLabel(task: Task): string {
    const labels: Record<Task['importance'], string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
      critica: 'Crítica',
    };

    return labels[task.importance];
  }

  getImportanceClass(task: Task): string {
    return `importance-${task.importance}`;
  }

  private buildTaskApiPayload(payload: TaskFormValue): CreateTaskRequestDto {
    return {
      title: payload.title,
      description: payload.description,
      estimatedMinutes: payload.estimatedMinutes,
      importance: payload.importance,
    };
  }

  backToRoutines(): void {
    this.router.navigate(['/routines']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineDetailFacadeService } from '@core/services/routine-detail-facade.service';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routine-detail.component.html',
  styleUrl: './routine-detail.component.scss',
})
export class RoutineDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
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
  readonly isDeletingTask = this.routineDetailFacade.isDeletingTask;
  readonly errorMessage = this.routineDetailFacade.errorMessage;

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
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    this.routineDetailFacade.deleteTask(taskId);
  }

  clearError(): void {
    this.routineDetailFacade.clearError();
  }

  backToRoutines(): void {
    this.router.navigate(['/routines']);
  }
}

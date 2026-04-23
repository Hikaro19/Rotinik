import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService, type Routine } from '../../../core/services/routine.service';

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
  private readonly routineService = inject(RoutineService);

  readonly rotineId = signal<string>('');
  readonly rotinaAtual = signal<Routine | undefined>(undefined);
  readonly loading = signal<boolean>(true);

  readonly rotneName = computed(() => this.rotinaAtual()?.title ?? 'Rotina');
  readonly rotineDescription = computed(() => this.rotinaAtual()?.description ?? '');
  readonly rotineIcon = computed(() => this.rotinaAtual()?.icon ?? '📋');
  readonly frequency = computed(() => this.rotinaAtual()?.frequency ?? 'daily');
  readonly allTasks = computed(() => this.rotinaAtual()?.tasks ?? []);

  readonly tarefasIniciais = computed(() => this.allTasks().filter((task) => !task.completed).slice(0, 1));
  readonly tarefasRestante = computed(() => this.allTasks().filter((task) => !task.completed).slice(1));

  readonly progresso = computed(() => {
    const tasks = this.allTasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  });

  readonly totalTarefas = computed(() => this.allTasks().length);
  readonly tarefasCompletas = computed(() => this.allTasks().filter((task) => task.completed).length);
  readonly seqenciaCompletamento = computed(() => this.rotinaAtual()?.completionStreak ?? 0);
  readonly xpTotal = computed(() => this.rotinaAtual()?.totalXP ?? 0);
  readonly moedasTotal = computed(() => this.rotinaAtual()?.totalCoins ?? 0);
  readonly rotinaCompleta = computed(() => this.tarefasCompletas() === this.totalTarefas() && this.totalTarefas() > 0);

  readonly nomeUsuario = computed(() => {
    const usuario = this.routineService.currentUserSignal();
    return usuario ? usuario.getNome() : 'Usuário';
  });
  readonly nivelUsuario = computed(() => this.routineService.userLevel());
  readonly moedasUsuario = computed(() => this.routineService.userCoins());

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'] as string;
      this.rotineId.set(id);

      const rotina = this.routineService.getRoutineById(id);
      if (rotina) {
        this.rotinaAtual.set(rotina);
        this.loading.set(false);
      } else {
        console.warn(`Rotina com ID ${id} nao encontrada`);
        this.loading.set(false);
      }
    });
  }

  completeTask(taskId: string): void {
    const routineId = this.rotineId();
    if (!routineId) {
      return;
    }

    this.routineService.completeTask(routineId, taskId);
    this.refreshRoutine();
  }

  uncompleteTask(taskId: string): void {
    const routineId = this.rotineId();
    if (!routineId) {
      return;
    }

    this.routineService.uncompleteTask(routineId, taskId);
    this.refreshRoutine();
  }

  deleteTask(taskId: string): void {
    const routineId = this.rotineId();
    if (!routineId || !confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    this.routineService.deleteTask(routineId, taskId);
    this.refreshRoutine();
  }

  backToRoutines(): void {
    this.router.navigate(['/routines']);
  }

  private refreshRoutine(): void {
    const rotina = this.routineService.getRoutineById(this.rotineId());
    if (rotina) {
      this.rotinaAtual.set(rotina);
    }
  }
}

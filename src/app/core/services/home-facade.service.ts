import { computed, Injectable, inject } from '@angular/core';
import { RoutineService } from './routine.service';

@Injectable({ providedIn: 'root' })
export class HomeFacadeService {
  private readonly routineService = inject(RoutineService);

  readonly rotinas = this.routineService.routinesSignal;
  readonly totalRotinas = this.routineService.totalRoutines;
  readonly rotinasCompletas = this.routineService.completedRoutines;
  readonly xpTotal = this.routineService.totalPossibleXP;
  readonly tarefasPendentes = this.routineService.totalPendingTasks;
  readonly maiorStreak = this.routineService.longestStreak;
  readonly usuarioAtual = this.routineService.currentUserSignal;
  readonly totalTarefas = computed(() => this.rotinas().reduce((sum, rotina) => sum + rotina.tasks.length, 0));
  readonly tarefasCompletas = computed(() =>
    this.rotinas().reduce((sum, rotina) => sum + rotina.tasks.filter((task) => task.completed).length, 0),
  );

  readonly nomeUsuario = computed(() => {
    const usuario = this.usuarioAtual();
    return usuario?.getNome() ?? 'Bem-Vindo';
  });

  readonly nivelUsuario = this.routineService.userLevel;
  readonly progressoNivel = this.routineService.userLevelProgress;
  readonly moedas = this.routineService.userCoins;

  readonly progressoMedio = computed(() => {
    const rotinas = this.rotinas();
    if (rotinas.length === 0) return 0;

    const totalTarefas = rotinas.reduce((sum, rotina) => sum + rotina.tasks.length, 0);
    const tarefasCompletas = rotinas.reduce(
      (sum, rotina) => sum + rotina.tasks.filter((task) => task.completed).length,
      0,
    );

    return totalTarefas > 0 ? Math.round((tarefasCompletas / totalTarefas) * 100) : 0;
  });

  readonly rotinasEmAndamento = computed(() =>
    this.rotinas()
      .filter((rotina) => !rotina.isCompleted && rotina.tasks.length > 0)
      .sort((a, b) => {
        const progressA = a.tasks.length > 0 ? a.tasks.filter((task) => task.completed).length / a.tasks.length : 0;
        const progressB = b.tasks.length > 0 ? b.tasks.filter((task) => task.completed).length / b.tasks.length : 0;
        return progressB - progressA;
      }),
  );

  readonly rotinasCompletasDetalhadas = computed(() =>
    this.rotinas()
      .filter((rotina) => rotina.isCompleted)
      .map((rotina) => ({
        id: rotina.id,
        titulo: rotina.title,
        descricao: rotina.description,
        icon: rotina.icon,
        xpTotal: rotina.totalXP,
        streak: rotina.completionStreak,
      })),
  );

  readonly statsCard = computed(() => ({
    totalRotinas: this.totalRotinas(),
    rotinasCompletas: this.rotinasCompletas(),
    xpDisponivel: this.xpTotal(),
    tarefasPendentes: this.tarefasPendentes(),
    maiorStreak: this.maiorStreak(),
  }));
}

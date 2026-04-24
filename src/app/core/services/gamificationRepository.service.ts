import { Injectable, computed, inject } from '@angular/core';
import { GamificationService } from './gamification.service';
import { RoutineService } from './routine.service';

@Injectable({
  providedIn: 'root',
})
export class GamificationRepository {
  private readonly gamificationService = inject(GamificationService);
  private readonly routineService = inject(RoutineService);

  readonly usuarioNivel = computed(() => this.gamificationService.playerSignal().level);
  readonly usuarioXP = computed(() => this.gamificationService.playerSignal().currentXP);
  readonly usuarioMoedas = computed(() => this.gamificationService.playerSignal().coins);
  readonly progressoNivel = this.gamificationService.xpProgress;
  readonly xpParaProximo = this.gamificationService.xpToNextLevel;

  readonly nivelStatus = computed(() => {
    const status = this.gamificationService.levelStatus();
    const labels: Record<string, string> = {
      starter: 'Iniciante',
      apprentice: 'Aprendiz',
      expert: 'Experiente',
      master: 'Mestre',
      elite: 'Elite',
    };
    return labels[status] || 'Iniciante';
  });

  readonly nivelCor = this.gamificationService.levelColor;

  calcularRewardRotina(rotinaId: string): { xp: number; moedas: number } {
    const rotina = this.routineService.getRoutineById(rotinaId);
    if (!rotina) {
      return { xp: 0, moedas: 0 };
    }

    const multiplicador = 1 + Math.floor(rotina.completionStreak / 5) * 0.1;
    return {
      xp: Math.floor(rotina.totalXP * multiplicador),
      moedas: Math.floor(rotina.totalCoins * multiplicador),
    };
  }

  calcularReputacao(tipoAcao: 'tarefa_completa' | 'rotina_completa' | 'consecutivos'): number {
    const mapa = {
      tarefa_completa: 5,
      rotina_completa: 50,
      consecutivos: 100,
    };
    return mapa[tipoAcao];
  }

  obterStats() {
    return {
      nivel: this.usuarioNivel(),
      experiencia: this.usuarioXP(),
      moedas: this.usuarioMoedas(),
      progressoNivel: this.progressoNivel(),
      xpParaProximo: this.xpParaProximo(),
      nivelStatus: this.nivelStatus(),
    };
  }

  completarTodasAsTarefas(): void {
    this.routineService.routinesSignal().forEach((routine) => {
      routine.tasks.filter((task) => !task.completed).forEach((task) => {
        this.routineService.completeTask(routine.id, task.id);
      });
    });
  }
}

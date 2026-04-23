import { Injectable, computed, inject } from '@angular/core';
import { RoutineService } from './routine.service';

@Injectable({
  providedIn: 'root',
})
export class GamificationRepository {
  private readonly routineService = inject(RoutineService);

  readonly usuarioNivel = computed(() => this.routineService.userLevel());
  readonly usuarioXP = computed(() => this.routineService.userXP());
  readonly usuarioMoedas = computed(() => this.routineService.userCoins());
  readonly progressoNivel = computed(() => this.routineService.userLevelProgress());
  readonly xpParaProximo = computed(() => this.routineService.xpToNextLevel());

  readonly nivelStatus = computed(() => {
    const nivel = this.usuarioNivel();
    if (nivel === 1) return 'Iniciante';
    if (nivel <= 5) return 'Aprendiz';
    if (nivel <= 10) return 'Experiente';
    if (nivel <= 20) return 'Mestre';
    return 'Elite';
  });

  readonly nivelCor = computed(() => {
    const status = this.nivelStatus();
    const cores: Record<string, string> = {
      Iniciante: 'var(--text-muted)',
      Aprendiz: 'var(--brand-neon)',
      Experiente: 'var(--game-coin)',
      Mestre: '#FFD700',
      Elite: 'var(--brand-neon)',
    };
    return cores[status] || 'var(--text-primary)';
  });

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

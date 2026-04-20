/**
 * 🎮 GamificationRepository (Singleton)
 * Gerencia XP, moedas, níveis e achievements
 * Funciona em sintonia com RotatinaRepository
 */

import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';
import { RotatinaRepository } from './rotinaRepository.service';

@Injectable({
  providedIn: 'root',
})
export class GamificationRepository {
  private rotinaRepo = inject(RotatinaRepository);

  // ─────────────────────────────────────────────────────────────
  // COMPUTED - Dados Derivados do Usuário
  // ─────────────────────────────────────────────────────────────

  usuarioNivel = computed(() => this.rotinaRepo.usuarioAtual()?.getNivel() ?? 0);

  usuarioXP = computed(() => this.rotinaRepo.usuarioAtual()?.getExperiencia() ?? 0);

  usuarioMoedas = computed(() => this.rotinaRepo.usuarioAtual()?.getMoedas() ?? 0);

  progressoNivel = computed(() => this.rotinaRepo.usuarioAtual()?.calcularProgressoNivel() ?? 0);

  xpParaProximo = computed(() => {
    const usuario = this.rotinaRepo.usuarioAtual();
    if (!usuario) return 0;
    const nivel = usuario.getNivel();
    return Math.floor(100 * Math.pow(nivel, 1.5));
  });

  nivelStatus = computed(() => {
    const nivel = this.usuarioNivel();
    if (nivel === 1) return 'Iniciante';
    if (nivel <= 5) return 'Aprendiz';
    if (nivel <= 10) return 'Experiente';
    if (nivel <= 20) return 'Mestre';
    return 'Elite';
  });

  nivelCor = computed(() => {
    const status = this.nivelStatus();
    const cores: Record<string, string> = {
      'Iniciante': 'var(--text-muted)',
      'Aprendiz': 'var(--brand-neon)',
      'Experiente': 'var(--game-coin)',
      'Mestre': '#FFD700', // Gold
      'Elite': 'var(--brand-neon)',
    };
    return cores[status] || 'var(--text-primary)';
  });

  // ─────────────────────────────────────────────────────────────
  // MÉTODOS - GAMIFICAÇÃO
  // ─────────────────────────────────────────────────────────────

  /**
   * Calcula reward por rotina completa
   * Baseado em XP total e dificuldade
   */
  calcularRewardRotina(rotinaId: string): { xp: number; moedas: number } {
    const rotina = this.rotinaRepo.obterRotina(rotinaId);
    if (!rotina) return { xp: 0, moedas: 0 };

    const xpTotal = rotina.calcularXPTotal();
    const moedasTotal = rotina.calcularMoedasTotal();
    const sequencia = rotina.getSequenciaCompletamento();

    // Bonus por sequência (streak multiplier)
    const multiplicador = 1 + Math.floor(sequencia / 5) * 0.1; // +10% a cada 5 completamentos

    return {
      xp: Math.floor(xpTotal * multiplicador),
      moedas: Math.floor(moedasTotal * multiplicador),
    };
  }

  /**
   * Calcula pontos de reputação ganhos
   */
  calcularReputacao(tipoAcao: 'tarefa_completa' | 'rotina_completa' | 'consecutivos'): number {
    const mapa = {
      tarefa_completa: 5,
      rotina_completa: 50,
      consecutivos: 100,
    };
    return mapa[tipoAcao];
  }

  /**
   * Retorna stats para display
   */
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

  /**
   * Simula completamento de todas as tarefas para teste visual
   */
  completarTodasAsTarefas(): void {
    const rotinas = this.rotinaRepo.rotinas();
    rotinas.forEach(rotina => {
      rotina.getTarefas().forEach(tarefa => {
        if (!tarefa.ehCompleta()) {
          this.rotinaRepo.concluirTarefa(rotina.getId(), tarefa.getId());
        }
      });
    });
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoutineService, type Routine } from '../../core/services/routine.service';
import { RotatinaRepository, GamificationRepository } from '../../core/services';

/**
 * 🏠 HomeComponent - TELA DE ROTINAS
 * Replica exata pixel a pixel do protótipo Figma
 * 
 * INTEGRAÇÃO DE DADOS DINÂMICOS:
 * - Consome dados de RoutineService (signals modernos)
 * - Usa GamificationRepository para stats do usuário
 * - Calcula progresso em tempo real
 * 
 * Estrutura:
 * 1. Card de Boas-vindas com progresso do usuário
 * 2. Toggle de abas (Tarefas / Rotinas)
 * 3. Seção "Em Andamento" com cards de rotinas dinâmicos
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);
  private routineService = inject(RoutineService);
  private rotinaRepo = inject(RotatinaRepository);
  private gamificationRepo = inject(GamificationRepository);

  // ─────────────────────────────────────────────────────────────
  // SIGNALS - Estado Local
  // ─────────────────────────────────────────────────────────────

  /**
   * Estado do toggle de abas
   * Valores: 'tarefas' | 'rotinas'
   * Padrão: 'rotinas' (conforme protótipo)
   */
  activeTab = signal<'tarefas' | 'rotinas'>('rotinas');

  /**
   * Filtro de estado de tarefas
   * Valores: 'todas' | 'pendente' | 'andamento' | 'concluida'
   */
  tarefaFiltro = signal<'todas' | 'pendente' | 'andamento' | 'concluida'>('todas');

  // ─────────────────────────────────────────────────────────────
  // INTEGRAÇÃO: RoutineService Signals
  // ─────────────────────────────────────────────────────────────

  /**
   * Todas as rotinas (dados dinâmicos)
   */
  rotinas = this.routineService.routinesSignal;

  /**
   * Total de rotinas
   */
  totalRotinas = this.routineService.totalRoutines;

  /**
   * Rotinas completas hoje
   */
  rotinasCompletas = this.routineService.completedRoutines;

  /**
   * Total de XP possível
   */
  xpTotal = this.routineService.totalPossibleXP;

  /**
   * Total de tarefas pendentes
   */
  tarefasPendentes = this.routineService.totalPendingTasks;

  /**
   * Maior streak
   */
  maiorStreak = this.routineService.longestStreak;

  // ─────────────────────────────────────────────────────────────
  // COMPUTED - Dados Derivados
  // ─────────────────────────────────────────────────────────────

  /**
   * Usuário atual (compatível com RotatinaRepository)
   */
  usuarioAtual = this.rotinaRepo.usuarioAtual;

  /**
   * Nome do usuário
   */
  nomeUsuario = computed(() => {
    const usuario = this.usuarioAtual();
    return usuario?.getNome() ?? 'Bem-Vindo';
  });

  /**
   * Nível do usuário
   */
  nivelUsuario = computed(() => this.gamificationRepo.usuarioNivel());

  /**
   * Progresso do nível (0-100)
   */
  progressoNivel = computed(() => this.gamificationRepo.progressoNivel());

  /**
   * Moedas do usuário
   */
  moedas = computed(() => this.gamificationRepo.usuarioMoedas());

  /**
   * Progresso médio de rotinas (0-100%)
   */
  progressoMedio = computed(() => {
    const rotinas = this.rotinas();
    if (rotinas.length === 0) return 0;
    
    const totalTarefas = rotinas.reduce((sum, r) => sum + r.tasks.length, 0);
    const completasTarefas = rotinas.reduce((sum, r) => {
      return sum + r.tasks.filter(t => t.completed).length;
    }, 0);
    
    return totalTarefas > 0 ? Math.round((completasTarefas / totalTarefas) * 100) : 0;
  });

  /**
   * Rotinas em andamento (não completas e com tarefas)
   */
  rotinasEmAndamento = computed(() => {
    return this.rotinas()
      .filter(r => !r.isCompleted && r.tasks.length > 0)
      .map(r => ({
        id: r.id,
        titulo: r.title,
        descricao: r.description,
        icon: r.icon,
        color: r.color,
        progresso: Math.round((r.tasks.filter(t => t.completed).length / r.tasks.length) * 100) || 0,
        totalTarefas: r.tasks.length,
        tarefasCompletas: r.tasks.filter(t => t.completed).length,
        xpTotal: r.totalXP,
        coinTotal: r.totalCoins,
        frequency: r.frequency,
      }))
      .sort((a, b) => b.progresso - a.progresso); // Ordenar por progresso decrescente
  });

  /**
   * Rotinas completas (para exibição opcional)
   */
  rotinasCompletas$ = computed(() => {
    return this.rotinas()
      .filter(r => r.isCompleted)
      .map(r => ({
        id: r.id,
        titulo: r.title,
        descricao: r.description,
        icon: r.icon,
        xpTotal: r.totalXP,
        streak: r.completionStreak,
      }));
  });

  /**
   * Stats para exibição no card
   */
  statsCard = computed(() => ({
    totalRotinas: this.totalRotinas(),
    rotinasCompletas: this.rotinasCompletas(),
    xpDisponivel: this.xpTotal(),
    tarefasPendentes: this.tarefasPendentes(),
    maiorStreak: this.maiorStreak(),
  }));

  // ─────────────────────────────────────────────────────────────
  // METHODS (compatíveis com template)
  // ─────────────────────────────────────────────────────────────

  /**
   * Troca a aba ativa
   */
  switchTab(tab: 'tarefas' | 'rotinas'): void {
    this.activeTab.set(tab);
  }

  /**
   * Navega para detalhes de uma rotina
   */
  goToRoutineDetail(routineId: string): void {
    this.router.navigate(['/routine', routineId]);
  }

  /**
   * Método fallback para compatibilidade
   */
  goToRoutinesList(): void {
    this.router.navigate(['/routines']);
  }
}

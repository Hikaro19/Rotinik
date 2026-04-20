import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService, type Routine, type Task } from '../../../core/services/routine.service';
import { RotatinaRepository, GamificationRepository } from '../../../core/services';

/**
 * 🏃 RoutineDetailComponent - TELA DENTRO DA ROTINA
 * INTEGRAÇÃO DE DADOS DINÂMICOS:
 * - Consome dados reais de RoutineService (signals)
 * - Permite concluir tarefas e ganhar XP
 * - Calcula progresso dinâmico em tempo real
 * - Usa Signals para reatividade
 * 
 * Estrutura:
 * 1. Progresso da rotina + Streak
 * 2. Tarefas "Ação Imediata" (pendentes/em andamento)
 * 3. Tarefas "Restante" (completas)
 * 4. Botão "+ Nova Tarefa"
 */
@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routine-detail.component.html',
  styleUrl: './routine-detail.component.scss',
})
export class RoutineDetailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private routineService = inject(RoutineService);
  private rotinaRepo = inject(RotatinaRepository);
  private gamificationRepo = inject(GamificationRepository);

  // ─────────────────────────────────────────────────────────────
  // SIGNALS - Estado Local
  // ─────────────────────────────────────────────────────────────

  /**
   * ID da rotina (extraído da rota)
   */
  rotineId = signal<string>('');

  /**
   * Rotina atual extraída do serviço
   */
  rotinaAtual = signal<Routine | undefined>(undefined);

  /**
   * Loading state
   */
  loading = signal<boolean>(true);

  // ─────────────────────────────────────────────────────────────
  // COMPUTED - Dados Derivados do RoutineService
  // ─────────────────────────────────────────────────────────────

  /**
   * Nome da rotina
   */
  rotneName = computed(() => this.rotinaAtual()?.title ?? 'Rotina');

  /**
   * Descrição da rotina
   */
  rotineDescription = computed(() => this.rotinaAtual()?.description ?? '');

  /**
   * Ícone da rotina
   */
  rotineIcon = computed(() => this.rotinaAtual()?.icon ?? '📋');

  /**
   * Frequência da rotina
   */
  frequency = computed(() => this.rotinaAtual()?.frequency ?? 'daily');

  /**
   * Todas as tarefas da rotina
   */
  allTasks = computed(() => this.rotinaAtual()?.tasks ?? []);

  /**
   * Tarefas de ação imediata (primeira não-completa)
   */
  tarefasIniciais = computed(() => {
    const tasks = this.allTasks();
    const incompletas = tasks.filter(t => !t.completed);
    return incompletas.slice(0, 1);
  });

  /**
   * Tarefas restantes (resto das não-completas + completas)
   */
  tarefasRestante = computed(() => {
    const tasks = this.allTasks();
    const incompletas = tasks.filter(t => !t.completed);
    return incompletas.slice(1); // Segunda tarefa em diante
  });

  /**
   * Progresso em porcentagem
   */
  progresso = computed(() => {
    const tasks = this.allTasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  });

  /**
   * Total de tarefas
   */
  totalTarefas = computed(() => this.allTasks().length);

  /**
   * Tarefas completas
   */
  tarefasCompletas = computed(() => {
    return this.allTasks().filter(t => t.completed).length;
  });

  /**
   * Sequência de completamentos (streak)
   */
  seqenciaCompletamento = computed(() => {
    const rotina = this.rotinaAtual();
    return rotina?.completionStreak ?? 0;
  });

  /**
   * XP total da rotina
   */
  xpTotal = computed(() => this.rotinaAtual()?.totalXP ?? 0);

  /**
   * Moedas totais da rotina
   */
  moedasTotal = computed(() => this.rotinaAtual()?.totalCoins ?? 0);

  /**
   * Status visual: todas tarefas completadas?
   */
  rotinaCompleta = computed(() => {
    return this.tarefasCompletas() === this.totalTarefas() && this.totalTarefas() > 0;
  });

  /**
   * Nome do usuário
   */
  nomeUsuario = computed(() => {
    const usuario = this.rotinaRepo.usuarioAtual();
    return usuario ? usuario.getNome() : 'Usuário';
  });

  /**
   * Nível do usuário
   */
  nivelUsuario = computed(() => this.gamificationRepository.usuarioNivel());

  /**
   * Moedas do usuário
   */
  moedasUsuario = computed(() => this.gamificationRepository.usuarioMoedas());

  // ─────────────────────────────────────────────────────────────
  // ALIAS para compatibilidade
  // ─────────────────────────────────────────────────────────────
  private gamificationRepository = this.gamificationRepo;

  // ─────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Extrair ID da rota
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'] as string;
      this.rotineId.set(id);
      
      // Buscar rotina no serviço
      const rotina = this.routineService.getRoutineById(id);
      if (rotina) {
        this.rotinaAtual.set(rotina);
        this.loading.set(false);
      } else {
        console.warn(`Rotina com ID ${id} não encontrada`);
        this.loading.set(false);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // METHODS - Ações de Tarefas
  // ─────────────────────────────────────────────────────────────

  /**
   * Marca uma tarefa como completa e calcula XP/Coins
   */
  completeTask(taskId: string): void {
    const routineId = this.rotineId();
    if (routineId) {
      const { xp, coins } = this.routineService.completeTask(routineId, taskId);
      console.log(`✅ Tarefa concluída! +${xp} XP, +${coins} Moedas`);
      
      // Atualizar dados locais
      const rotina = this.routineService.getRoutineById(routineId);
      if (rotina) {
        this.rotinaAtual.set(rotina);
      }
    }
  }

  /**
   * Marca uma tarefa como incompleta
   */
  uncompleteTask(taskId: string): void {
    const routineId = this.rotineId();
    if (routineId) {
      this.routineService.uncompleteTask(routineId, taskId);
      
      // Atualizar dados locais
      const rotina = this.routineService.getRoutineById(routineId);
      if (rotina) {
        this.rotinaAtual.set(rotina);
      }
    }
  }

  /**
   * Deleta uma tarefa
   */
  deleteTask(taskId: string): void {
    const routineId = this.rotineId();
    if (routineId && confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.routineService.deleteTask(routineId, taskId);
      
      // Atualizar dados locais
      const rotina = this.routineService.getRoutineById(routineId);
      if (rotina) {
        this.rotinaAtual.set(rotina);
      }
    }
  }

  /**
   * Volta para a lista de rotinas
   */
  backToRoutines(): void {
    this.router.navigate(['/routines']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeFacadeService } from '../routines/services/home-facade.service';
import { AppRoutineCardComponent } from '@shared/components/feature/routine-card/routine-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AppRoutineCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly homeFacade = inject(HomeFacadeService);

  readonly activeTab = signal<'tarefas' | 'rotinas' | 'concluidas'>('rotinas');
  readonly tarefaFiltro = signal<'todas' | 'pendente' | 'andamento' | 'concluida'>('todas');

  readonly rotinas = this.homeFacade.rotinas;
  readonly totalRotinas = this.homeFacade.totalRotinas;
  readonly rotinasCompletas = this.homeFacade.rotinasCompletas;
  readonly xpTotal = this.homeFacade.xpTotal;
  readonly tarefasPendentes = this.homeFacade.tarefasPendentes;
  readonly maiorStreak = this.homeFacade.maiorStreak;
  readonly usuarioAtual = this.homeFacade.usuarioAtual;
  readonly nomeUsuario = this.homeFacade.nomeUsuario;
  readonly usernameUsuario = this.homeFacade.usernameUsuario;
  readonly nivelUsuario = this.homeFacade.nivelUsuario;
  readonly progressoNivel = this.homeFacade.progressoNivel;
  readonly moedas = this.homeFacade.moedas;
  readonly progressoMedio = this.homeFacade.progressoMedio;
  readonly rotinasEmAndamento = this.homeFacade.rotinasEmAndamento;
  readonly rotinasCompletas$ = this.homeFacade.rotinasCompletasDetalhadas;
  readonly statsCard = this.homeFacade.statsCard;

  readonly avatarUrl = this.homeFacade.avatarUrl;
  readonly avatarBorderUrl = this.homeFacade.avatarBorderUrl;
  readonly levelIconUrl = this.homeFacade.levelIconUrl;

  switchTab(tab: 'tarefas' | 'rotinas' | 'concluidas'): void {
    this.activeTab.set(tab);
  }

  goToRoutineDetail(routineId: string): void {
    this.router.navigate(['/routine', routineId]);
  }

  goToRoutinesList(): void {
    this.router.navigate(['/routines']);
  }

  onToggleTask(event: { routineId: string, taskId: string, completed: boolean }): void {
    if (event.completed) {
      this.homeFacade.completeTask(event.routineId, event.taskId);
    } else {
      this.homeFacade.uncompleteTask(event.routineId, event.taskId);
    }
  }
}

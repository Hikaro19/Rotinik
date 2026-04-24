import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeFacadeService } from '@core/services/home-facade.service';
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

  activeTab = signal<'tarefas' | 'rotinas'>('rotinas');
  tarefaFiltro = signal<'todas' | 'pendente' | 'andamento' | 'concluida'>('todas');

  rotinas = this.homeFacade.rotinas;
  totalRotinas = this.homeFacade.totalRotinas;
  rotinasCompletas = this.homeFacade.rotinasCompletas;
  xpTotal = this.homeFacade.xpTotal;
  tarefasPendentes = this.homeFacade.tarefasPendentes;
  maiorStreak = this.homeFacade.maiorStreak;
  usuarioAtual = this.homeFacade.usuarioAtual;
  nomeUsuario = this.homeFacade.nomeUsuario;
  nivelUsuario = this.homeFacade.nivelUsuario;
  progressoNivel = this.homeFacade.progressoNivel;
  moedas = this.homeFacade.moedas;
  progressoMedio = this.homeFacade.progressoMedio;
  rotinasEmAndamento = this.homeFacade.rotinasEmAndamento;
  rotinasCompletas$ = this.homeFacade.rotinasCompletasDetalhadas;
  statsCard = this.homeFacade.statsCard;

  switchTab(tab: 'tarefas' | 'rotinas'): void {
    this.activeTab.set(tab);
  }

  goToRoutineDetail(routineId: string): void {
    this.router.navigate(['/routine', routineId]);
  }

  goToRoutinesList(): void {
    this.router.navigate(['/routines']);
  }
}

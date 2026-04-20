import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

/**
 * LeaderboardComponent: Ranking global de jogadores
 * Mostra usuários ordenados por XP/Level/Achievements
 * Destaca top 3 com medals
 */
@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AppCardComponent, AppButtonComponent, AppInputComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private router = inject(Router);
  userService = inject(UserService);

  /**
   * Sinal de busca
   */
  searchQuerySignal = signal<string>('');
  searchQueryText = '';

  /**
   * Handle sort type change
   */
  changeSortType(type: 'xp' | 'level' | 'achievements'): void {
    this.userService.setSortType(type);
  }

  /**
   * Atualizar query de busca
   */
  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
  }

  /**
   * Handle follow/unfollow
   */
  toggleFollow(userId: string): void {
    this.userService.toggleFollow(userId);
  }

  /**
   * Navegar para perfil público
   */
  goToProfile(userId: string): void {
    this.router.navigate(['/friends/profile', userId]);
  }

  /**
   * Obter cor para medal
   */
  getMedalColor(medal: string | undefined): string {
    const colors: Record<string, string> = {
      gold: 'var(--game-coin)',    // #ffb33d
      silver: '#c0c0c0',
      bronze: '#cd7f32',
    };
    return colors[medal || ''] || 'var(--text-muted)';
  }

  /**
   * Obter ícone para medal
   */
  getMedalIcon(medal: string | undefined): string {
    const icons: Record<string, string> = {
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉',
    };
    return icons[medal || ''] || '•';
  }

  /**
   * Obter label formatado da métrica atual
   */
  getSortLabel(sortType: string): string {
    const labels: Record<string, string> = {
      xp: 'Total XP',
      level: 'Nível',
      achievements: 'Achievements',
    };
    return labels[sortType] || '';
  }

  /**
   * Obter valor da métrica para o usuário
   */
  getMetricValue(user: any, sortType: string): number {
    switch (sortType) {
      case 'level':
        return user.level;
      case 'achievements':
        return user.achievements;
      case 'xp':
      default:
        return user.totalXP;
    }
  }

  /**
   * Formatar números grandes
   */
  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  /**
   * Verificar se é o usuário atual
   */
  isCurrentUser(userId: string): boolean {
    return userId === this.userService.currentUserSignal().id;
  }
}

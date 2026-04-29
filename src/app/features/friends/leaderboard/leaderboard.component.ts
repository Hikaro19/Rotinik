import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaderboardFacadeService } from '@core/services/leaderboard-facade.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AppCardComponent, AppButtonComponent, AppInputComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private router = inject(Router);
  leaderboardFacade = inject(LeaderboardFacadeService);

  searchQuerySignal = signal<string>('');
  searchQueryText = '';
  leaderboardEntries = computed(() => this.leaderboardFacade.filteredLeaderboard(this.searchQuerySignal()));
  topThree = computed(() => this.leaderboardEntries().slice(0, 3));
  remainingEntries = computed(() => this.leaderboardEntries().slice(3));

  changeSortType(type: 'xp' | 'level' | 'achievements'): void {
    this.leaderboardFacade.setSortType(type);
  }

  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
  }

  toggleFollow(userId: string): void {
    this.leaderboardFacade.toggleFollow(userId);
  }

  goToProfile(userId: string): void {
    this.router.navigate(['/friends/profile', userId]);
  }

  getMedalColor(medal: string | undefined): string {
    const colors: Record<string, string> = {
      gold: 'var(--game-coin)',
      silver: '#c0c0c0',
      bronze: '#cd7f32',
    };
    return colors[medal || ''] || 'var(--text-muted)';
  }

  getMedalIcon(medal: string | undefined): string {
    const icons: Record<string, string> = {
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉',
    };
    return icons[medal || ''] || '•';
  }

  getSortLabel(sortType: string): string {
    const labels: Record<string, string> = {
      xp: 'Total XP',
      level: 'Nivel',
      achievements: 'Achievements',
    };
    return labels[sortType] || '';
  }

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

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  isCurrentUser(userId: string): boolean {
    return this.leaderboardFacade.isCurrentUser(userId);
  }
}

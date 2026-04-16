import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../../../core/services/gamification.service';
import { ProfileService } from '../../../../core/services/profile.service';

/**
 * ProfileStatsComponent: Estatísticas em grid
 */
@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-stats.component.html',
  styleUrl: './profile-stats.component.scss',
})
export class ProfileStatsComponent {
  readonly daysSinceStart = this.profileService.daysSinceStart;
  readonly activeDays = this.profileService.activeDays;
  readonly activityPercentage = this.profileService.activityPercentage;
  readonly unlockedAchievements = this.profileService.unlockedAchievements;

  constructor(
    private gamificationService: GamificationService,
    private profileService: ProfileService,
  ) {}

  /**
   * Obter ícone por tipo de stat
   */
  getIcon(type: string): string {
    const icons: Record<string, string> = {
      days: '📅',
      active: '✅',
      percentage: '📈',
      achievements: '🏆',
    };
    return icons[type] || '📊';
  }
}

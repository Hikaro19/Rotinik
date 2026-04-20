import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../core/services/gamification.service';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';
import { ProfileActivityHeatmapComponent } from './components/profile-activity-heatmap/profile-activity-heatmap.component';
import { ProfileAchievementsComponent } from './components/profile-achievements/profile-achievements.component';
import { ProfileHistoryComponent } from './components/profile-history/profile-history.component';

/**
 * ProfileComponent: Dashboard do usuário
 * Mostra estatísticas, achievements, atividade e histórico
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileStatsComponent,
    ProfileActivityHeatmapComponent,
    ProfileAchievementsComponent,
    ProfileHistoryComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  // Signals do serviço de gamificação
  playerSignal = this.gamificationService.playerSignal;
  xpToNextLevel = this.gamificationService.xpToNextLevel;
  xpProgress = this.gamificationService.xpProgress;
  levelStatus = this.gamificationService.levelStatus;

  // Signals do serviço de perfil
  achievements = this.profileService.achievementsSignal;
  memberSince = this.profileService.memberSinceSignal;
  unlockedAchievements = this.profileService.unlockedAchievements;
  totalAchievements = this.profileService.totalAchievements;
  daysSinceStart = this.profileService.daysSinceStart;
  activityPercentage = this.profileService.activityPercentage;

  constructor(
    private gamificationService: GamificationService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    // Inicializações necessárias
  }

  /**
   * Formatar data para exibição
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

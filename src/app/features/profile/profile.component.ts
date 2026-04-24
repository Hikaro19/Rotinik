import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';
import { ProfileActivityHeatmapComponent } from './components/profile-activity-heatmap/profile-activity-heatmap.component';
import { ProfileAchievementsComponent } from './components/profile-achievements/profile-achievements.component';
import { ProfileHistoryComponent } from './components/profile-history/profile-history.component';
import { AppSectionPanelComponent } from '@shared/components/ui/section-panel/section-panel.component';
import { ProfileFacadeService } from '@core/services/profile-facade.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileStatsComponent,
    ProfileActivityHeatmapComponent,
    ProfileAchievementsComponent,
    ProfileHistoryComponent,
    AppSectionPanelComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly profileFacade = inject(ProfileFacadeService);

  readonly playerSignal = this.profileFacade.player;
  readonly xpToNextLevel = this.profileFacade.xpToNextLevel;
  readonly xpProgress = this.profileFacade.xpProgress;
  readonly levelStatus = this.profileFacade.levelStatus;
  readonly memberSince = this.profileFacade.memberSince;
  readonly unlockedAchievements = this.profileFacade.unlockedAchievements;
  readonly totalAchievements = this.profileFacade.totalAchievements;
  readonly daysSinceStart = this.profileFacade.daysSinceStart;
  readonly activityPercentage = this.profileFacade.activityPercentage;
  readonly activitySummary = this.profileFacade.activitySummary;
  readonly achievementSummary = this.profileFacade.achievementSummary;

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

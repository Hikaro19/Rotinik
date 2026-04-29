import { computed, Injectable, inject } from '@angular/core';
import { GamificationService } from './gamification.service';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class ProfileFacadeService {
  private readonly gamificationService = inject(GamificationService);
  private readonly profileService = inject(ProfileService);

  readonly player = this.gamificationService.playerSignal;
  readonly xpToNextLevel = this.gamificationService.xpToNextLevel;
  readonly xpProgress = this.gamificationService.xpProgress;
  readonly levelStatus = this.gamificationService.levelStatus;

  readonly achievements = this.profileService.achievementsSignal;
  readonly activityHistory = this.profileService.activityHistorySignal;
  readonly memberSince = this.profileService.memberSinceSignal;
  readonly historyItems = this.profileService.historyItemsSignal;
  readonly profileStats = this.profileService.profileStatsSignal;
  readonly unlockedAchievements = this.profileService.unlockedAchievements;
  readonly totalAchievements = this.profileService.totalAchievements;
  readonly daysSinceStart = this.profileService.daysSinceStart;
  readonly activityPercentage = this.profileService.activityPercentage;

  readonly achievementSummary = computed(() => `${this.unlockedAchievements()}/${this.totalAchievements()}`);
  readonly activitySummary = computed(() => `${this.activityPercentage()}% ativo`);
}

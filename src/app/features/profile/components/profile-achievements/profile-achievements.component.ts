import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, Achievement } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-achievements.component.html',
  styleUrl: './profile-achievements.component.scss',
})
export class ProfileAchievementsComponent {
  readonly achievements = this.profileService.achievementsSignal;

  constructor(private profileService: ProfileService) {}

  isUnlocked(achievement: Achievement): boolean {
    return !!achievement.unlockedDate;
  }

  getProgressPercentage(achievement: Achievement): number {
    if (!achievement.progress || !achievement.target) return 0;
    return Math.min((achievement.progress / achievement.target) * 100, 100);
  }

  translateRarity(rarity: string): string {
    const translations: Record<string, string> = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Epico',
      legendary: 'Lendario',
    };
    return translations[rarity] || rarity;
  }

  formatUnlockedDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  }
}

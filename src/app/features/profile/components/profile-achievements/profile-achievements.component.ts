import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, Achievement } from '../../../../core/services/profile.service';

/**
 * ProfileAchievementsComponent: Exibe badges e conquistas
 */
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

  /**
   * Verificar se achievement está desbloqueado
   */
  isUnlocked(achievement: Achievement): boolean {
    return !!achievement.unlockedDate;
  }

  /**
   * Calcular progresso em porcentagem
   */
  getProgressPercentage(achievement: Achievement): number {
    if (!achievement.progress || !achievement.target) return 0;
    return Math.min((achievement.progress / achievement.target) * 100, 100);
  }

  /**
   * Obter cor por raridade
   */
  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: '#888',
      rare: '#4169e1',
      epic: '#9932cc',
      legendary: '#ffd700',
    };
    return colors[rarity] || '#888';
  }

  /**
   * Traduzir raridade
   */
  translateRarity(rarity: string): string {
    const translations: Record<string, string> = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário',
    };
    return translations[rarity] || rarity;
  }

  /**
   * Formatar data de desbloqueio
   */
  formatUnlockedDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  }
}

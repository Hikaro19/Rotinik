import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSectionPanelComponent } from '@shared/components/ui/section-panel/section-panel.component';
import { ProfileHistoryItem, ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile-history',
  standalone: true,
  imports: [CommonModule, AppSectionPanelComponent],
  templateUrl: './profile-history.component.html',
  styleUrl: './profile-history.component.scss',
})
export class ProfileHistoryComponent {
  readonly historyItems = this.profileService.historyItemsSignal;

  constructor(private profileService: ProfileService) {}

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atras`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  getTypeColor(type: ProfileHistoryItem['type']): string {
    const colors: Record<ProfileHistoryItem['type'], string> = {
      purchase: '#667eea',
      achievement: '#ffd700',
      'level-up': '#ff6b6b',
    };
    return colors[type];
  }

  translateType(type: ProfileHistoryItem['type']): string {
    const translations: Record<ProfileHistoryItem['type'], string> = {
      purchase: 'Compra',
      achievement: 'Achievement',
      'level-up': 'Level Up',
    };
    return translations[type];
  }
}

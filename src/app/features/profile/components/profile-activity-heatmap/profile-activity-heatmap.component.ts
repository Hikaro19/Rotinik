import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../core/services/profile.service';

/**
 * ProfileActivityHeatmapComponent: Heatmap de atividade (últimos 90 dias)
 */
@Component({
  selector: 'app-profile-activity-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-activity-heatmap.component.html',
  styleUrl: './profile-activity-heatmap.component.scss',
})
export class ProfileActivityHeatmapComponent {
  readonly activityHistory = this.profileService.activityHistorySignal;

  // Grid de atividade (7 colunas, X linhas = 90 dias)
  readonly weeks: any[][] = [];

  constructor(private profileService: ProfileService) {
    this.generateWeeks();
  }

  /**
   * Gerar matriz de semanas para o heatmap
   */
  private generateWeeks(): void {
    const activity = this.profileService.getActivityHistory();
    let week: any[] = [];

    for (let i = 0; i < activity.length; i++) {
      const day = activity[i];
      const dayOfWeek = day.date.getDay();

      week.push({
        date: day.date,
        completed: day.completed,
        dayOfWeek,
        dayName: day.date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      });

      if (dayOfWeek === 6) {
        this.weeks.push([...week]);
        week = [];
      }
    }

    if (week.length > 0) {
      this.weeks.push([...week]);
    }
  }

  /**
   * Obter classe de intensidade para a célula
   */
  getIntensityClass(completed: boolean): string {
    return completed ? 'active' : 'inactive';
  }

  /**
   * Obter título para a célula (tooltip)
   */
  getTooltip(date: Date, completed: boolean): string {
    const dateStr = date.toLocaleDateString('pt-BR');
    const status = completed ? '✓ Completo' : '✗ Não completo';
    return `${dateStr}: ${status}`;
  }
}

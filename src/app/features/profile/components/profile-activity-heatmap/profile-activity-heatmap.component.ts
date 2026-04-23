import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../core/services/profile.service';

interface HeatmapDay {
  date: Date;
  completed: boolean;
  dayOfWeek: number;
  dayName: string;
}

@Component({
  selector: 'app-profile-activity-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-activity-heatmap.component.html',
  styleUrl: './profile-activity-heatmap.component.scss',
})
export class ProfileActivityHeatmapComponent {
  readonly activityHistory = this.profileService.activityHistorySignal;

  readonly weeks = computed(() => {
    const activity = this.activityHistory();
    const weeks: HeatmapDay[][] = [];
    let week: HeatmapDay[] = [];

    activity.forEach((day) => {
      const dayOfWeek = day.date.getDay();

      week.push({
        date: day.date,
        completed: day.completed,
        dayOfWeek,
        dayName: day.date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      });

      if (dayOfWeek === 6) {
        weeks.push([...week]);
        week = [];
      }
    });

    if (week.length > 0) {
      weeks.push([...week]);
    }

    return weeks;
  });

  constructor(private profileService: ProfileService) {}

  getIntensityClass(completed: boolean): string {
    return completed ? 'active' : 'inactive';
  }

  getTooltip(date: Date, completed: boolean): string {
    const dateStr = date.toLocaleDateString('pt-BR');
    const status = completed ? 'Completo' : 'Nao completo';
    return `${dateStr}: ${status}`;
  }
}

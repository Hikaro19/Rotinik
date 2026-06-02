import { Injectable } from '@angular/core';
import {
  RoutineDto,
  RoutineTaskDto,
  TaskImportance,
} from '../models/routine-api.models';
import { RoutineViewModel, TaskViewModel } from '../models/routine-view.models';

@Injectable({ providedIn: 'root' })
export class RoutineMapperService {
  mapApiRoutinesToViewModels(routines: RoutineDto[]): RoutineViewModel[] {
    return routines.map((routine) => this.mapApiRoutineToViewModel(routine));
  }

  mapApiRoutineToViewModel(routine: RoutineDto): RoutineViewModel {
    const fallbackTheme = { icon: 'RT', color: 'var(--purple-primary)' };
    const theme = routine.category ? this.resolveRoutineTheme(routine.category) : fallbackTheme;
    const tasks = routine.tasks ? routine.tasks.map((task) => this.mapApiTaskToViewModel(task, routine.id)) : [];

    const totalXP = tasks.reduce((sum, task) => sum + (task.xpReward || 0), 0);
    const totalCoins = tasks.reduce((sum, task) => sum + (task.coinReward || 0), 0);
    const isCompleted = tasks.length > 0 && tasks.every((task) => task.completed);

    return {
      id: routine.id.toString(),
      title: routine.title,
      description: routine.description ?? '',
      category: routine.category,
      icon: theme.icon,
      color: theme.color,
      frequency: (routine.frequency as RoutineViewModel['frequency']) || 'daily',
      tasks,
      totalXP,
      totalCoins,
      createdDate: new Date(routine.createdAt),
      completionStreak: 0,
      lastCompletedDate: undefined,
      isCompleted,
    };
  }

  mapApiTaskToViewModel(task: RoutineTaskDto, routineId: string | number): TaskViewModel {
    return {
      id: task.taskId?.toString() ?? task.id.toString(),
      routineId: routineId.toString(),
      title: task.title,
      description: task.description,
      completed: task.isCompleted,
      importance: this.normalizeTaskImportance(task.importance),
      estimatedMinutes: task.estimatedMinutes ?? 30,
      xpReward: task.xpReward ?? 0,
      coinReward: task.coinReward ?? 0,
      order: task.order,
      completedDate: task.completedAt ? new Date(task.completedAt) : undefined,
    };
  }

  private normalizeTaskImportance(importance?: string): TaskImportance {
    const normalized = importance?.trim().toLowerCase();
    if (normalized === 'baixa' || normalized === 'media' || normalized === 'alta' || normalized === 'critica') {
      return normalized;
    }
    return 'media';
  }

  private resolveRoutineTheme(category?: string): { icon: string; color: string } {
    const normalized = category?.trim().toLowerCase() ?? 'geral';

    const themes: Record<string, { icon: string; color: string }> = {
      saude:        { icon: 'SA', color: 'var(--game-success)' },
      estudos:      { icon: 'ES', color: 'var(--purple-neon)' },
      trabalho:     { icon: 'TR', color: '#60A5FA' },
      casa:         { icon: 'CA', color: '#F59E0B' },
      social:       { icon: 'SO', color: '#EC4899' },
      mindfulness:  { icon: 'MI', color: '#A78BFA' },
      lazer:        { icon: 'LA', color: '#22C55E' },
      leitura:      { icon: 'LE', color: '#F97316' },
      geral:        { icon: 'RT', color: 'var(--purple-primary)' },
    };

    return themes[normalized] ?? themes['geral'];
  }
}

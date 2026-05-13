import { Injectable } from '@angular/core';
import { RoutineDto, RoutineTaskDto, RoutineSummaryResponse } from '@core/models/api';
import { Usuario, Rotina, Tarefa, EFrequencia, EDificuldadeTarefa } from '@core/models/domain';
import { RoutineViewModel, TaskViewModel } from '@core/models/view/routine-view.models';

@Injectable({ providedIn: 'root' })
export class RoutineMapperService {
  mapApiRoutinesToViewModels(routines: RoutineDto[]): RoutineViewModel[] {
    return routines.map((routine) => this.mapApiRoutineToViewModel(routine));
  }

  mapApiRoutineToViewModel(routine: RoutineDto): RoutineViewModel {
    const fallbackTheme = {
      icon: 'RT',
      color: 'var(--purple-primary)',
    };
    const theme = routine.theme ? this.resolveRoutineTheme(routine.theme) : fallbackTheme;
    const tasks = routine.tasks ? routine.tasks.map((task) => this.mapApiTaskToViewModel(task, routine.id)) : [];

    const totalXP = tasks.reduce((sum, task) => sum + (task.xpReward || 0), 0);
    const totalCoins = tasks.reduce((sum, task) => sum + (task.coinReward || 0), 0);
    const isCompleted = tasks.length > 0 && tasks.every((task) => task.completed);

    return {
      id: routine.id.toString(),
      title: routine.name,
      description: routine.description ?? '',
      category: routine.theme,
      icon: theme.icon,
      color: theme.color,
      frequency: 'daily', // Backend doesn't support frequency at the routine level yet
      tasks: tasks,
      totalXP: totalXP,
      totalCoins: totalCoins,
      createdDate: new Date(routine.createdAt),
      completionStreak: 0, // Wait for FMRT_14 fully
      lastCompletedDate: undefined,
      isCompleted: isCompleted,
    };
  }

  mapApiTaskToViewModel(task: RoutineTaskDto, routineId: string | number): TaskViewModel {
    const estimatedMinutes = task.estimatedMinutes ?? 0;
    const elapsedMinutes = task.elapsedMinutes ?? 0;
    const startedAt = task.startedAt ? new Date(task.startedAt) : undefined;

    return {
      id: task.taskId?.toString() ?? task.id.toString(),
      routineId: routineId.toString(),
      title: task.taskTitle ?? task.title ?? 'Tarefa',
      description: task.taskDescription ?? task.description,
      completed: task.isCompleted,
      xpReward: task.xpReward || 10, // Fallback since backend doesn't have it yet
      coinReward: task.coinReward || 5, // Fallback
      estimatedMinutes,
      elapsedMinutes,
      startedAt,
      canComplete: Boolean(task.canComplete ?? (startedAt && elapsedMinutes >= estimatedMinutes)),
      order: task.order,
      completedDate: task.completedAt ? new Date(task.completedAt) : undefined,
    };
  }

  mapDomainRoutineToViewModel(rotina: Rotina): RoutineViewModel {
    const theme = this.resolveRoutineTheme(rotina.getCategoria());

    return {
      id: rotina.getId(),
      title: rotina.getTitulo(),
      description: rotina.getDescricao(),
      category: rotina.getCategoria(),
      icon: theme.icon,
      color: theme.color,
      frequency: this.mapFrequency(rotina.getFrequencia()),
      tasks: rotina.getTarefas().map((task, index) => ({
        id: task.getId(),
        routineId: rotina.getId(),
        title: task.getTitulo(),
        description: task.getDescricao(),
        completed: task.ehCompleta(),
        xpReward: task.getXPRecompensa(),
        coinReward: task.getMoedasRecompensa(),
        estimatedMinutes: 0,
        elapsedMinutes: 0,
        canComplete: true,
        order: index + 1,
        completedDate: task.getDataConclusao(),
      })),
      totalXP: rotina.calcularXPTotal(),
      totalCoins: rotina.calcularMoedasTotal(),
      createdDate: rotina.getDataCriacao(),
      completionStreak: rotina.getSequenciaCompletamento(),
      lastCompletedDate: rotina.getUltimoCompletamento(),
      isCompleted: rotina.calcularProgresso() === 100,
      domainModel: rotina,
    };
  }

  createDomainTask(taskData: {
    title: string;
    description?: string;
    xpReward: number;
    coinReward: number;
  }): Tarefa {
    return new Tarefa(
      taskData.title,
      taskData.description ?? '',
      taskData.xpReward,
      taskData.coinReward,
      EDificuldadeTarefa.MEDIA,
    );
  }

  private mapFrequency(frequency: EFrequencia): RoutineViewModel['frequency'] {
    const map: Record<EFrequencia, RoutineViewModel['frequency']> = {
      [EFrequencia.DIARIA]: 'daily',
      [EFrequencia.SEMANAL]: 'weekly',
      [EFrequencia.MENSAL]: 'monthly',
    };

    return map[frequency];
  }

  private resolveRoutineTheme(category?: string): { icon: string; color: string } {
    const normalized = category?.trim().toLowerCase() ?? 'geral';

    const themes: Record<string, { icon: string; color: string }> = {
      saude: { icon: 'SA', color: 'var(--game-success)' },
      estudos: { icon: 'ES', color: 'var(--purple-neon)' },
      trabalho: { icon: 'TR', color: '#60A5FA' },
      casa: { icon: 'CA', color: '#F59E0B' },
      social: { icon: 'SO', color: '#EC4899' },
      mindfulness: { icon: 'MI', color: '#A78BFA' },
      lazer: { icon: 'LA', color: '#22C55E' },
      leitura: { icon: 'LE', color: '#F97316' },
      geral: { icon: 'RT', color: 'var(--purple-primary)' },
    };

    return themes[normalized] ?? themes['geral'];
  }
}


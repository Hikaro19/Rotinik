import { Injectable } from '@angular/core';
import { RoutineDto, RoutineTaskDto, RoutinesSnapshotDto } from '@core/models/api';
import { Usuario, Rotina, Tarefa, EFrequencia, EDificuldadeTarefa } from '@core/models/domain';
import { RoutineViewModel, TaskViewModel } from '@core/models/view/routine-view.models';

@Injectable({ providedIn: 'root' })
export class RoutineMapperService {
  mapSnapshotFromApi(snapshot: RoutinesSnapshotDto): RoutineViewModel[] {
    return snapshot.routines.map((routine) => this.mapApiRoutineToViewModel(routine));
  }

  mapApiRoutineToViewModel(routine: RoutineDto): RoutineViewModel {
    const fallbackTheme = {
      icon: routine.icon ?? 'RT',
      color: routine.color ?? 'var(--purple-primary)',
    };
    const theme = routine.category ? this.resolveRoutineTheme(routine.category) : fallbackTheme;

    return {
      id: routine.id,
      title: routine.title,
      description: routine.description,
      category: routine.category,
      icon: routine.icon ?? theme.icon,
      color: routine.color ?? theme.color,
      frequency: routine.frequency,
      tasks: routine.tasks.map((task) => this.mapApiTaskToViewModel(task, routine.id)),
      totalXP: routine.totalXp,
      totalCoins: routine.totalCoins,
      createdDate: new Date(routine.createdAt),
      completionStreak: routine.completionStreak,
      lastCompletedDate: routine.lastCompletedAt ? new Date(routine.lastCompletedAt) : undefined,
      isCompleted: routine.isCompleted,
    };
  }

  mapApiTaskToViewModel(task: RoutineTaskDto, routineId: string): TaskViewModel {
    return {
      id: task.id,
      routineId,
      title: task.title,
      description: task.description,
      completed: task.isCompleted,
      xpReward: task.xpReward,
      coinReward: task.coinReward,
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

  createUserFromApiSnapshot(snapshot: RoutinesSnapshotDto): Usuario {
    const user = new Usuario(snapshot.user.name, snapshot.user.email);
    const totalXp = Math.max(snapshot.user.totalXp, 0);

    if (totalXp > 0) {
      user.adicionarXP(totalXp, 'API snapshot');
    }

    const currentCoins = user.getMoedas();
    const targetCoins = snapshot.user.coins;

    if (targetCoins > currentCoins) {
      user.ganharMoedas(targetCoins - currentCoins);
    } else if (targetCoins < currentCoins) {
      user.gastarMoedas(currentCoins - targetCoins);
    }

    return user;
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

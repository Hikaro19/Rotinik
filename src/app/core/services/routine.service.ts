import { Injectable, computed, signal } from '@angular/core';
import { EFrequencia, Rotina } from '@core/models/domain';

/**
 * Interface de Tarefa
 */
export interface Task {
  id: string;
  routineId: string;
  title: string;
  description?: string;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  dueDate?: Date;
  completedDate?: Date;
  order: number;
}

/**
 * Interface de Rotina para a camada de apresentacao.
 */
export interface Routine {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  tasks: Task[];
  totalXP: number;
  totalCoins: number;
  createdDate: Date;
  completionStreak: number;
  lastCompletedDate?: Date;
  isCompleted: boolean;
  domainModel?: Rotina;
}

@Injectable({ providedIn: 'root' })
export class RoutineService {
  routinesSignal = signal<Routine[]>([
    {
      id: 'routine-1',
      title: 'Exercicio Matinal',
      description: 'Treino de 30 minutos com foco em resistencia',
      category: 'Saude',
      icon: 'SA',
      color: 'var(--game-success)',
      frequency: 'daily',
      tasks: [
        {
          id: 'task-1-1',
          routineId: 'routine-1',
          title: 'Alongamento',
          completed: true,
          xpReward: 10,
          coinReward: 5,
          order: 1,
          completedDate: new Date(),
        },
        {
          id: 'task-1-2',
          routineId: 'routine-1',
          title: 'Cardio 15 min',
          completed: false,
          xpReward: 20,
          coinReward: 10,
          order: 2,
        },
        {
          id: 'task-1-3',
          routineId: 'routine-1',
          title: 'Musculacao',
          completed: false,
          xpReward: 20,
          coinReward: 10,
          order: 3,
        },
      ],
      totalXP: 50,
      totalCoins: 25,
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completionStreak: 5,
      lastCompletedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
    {
      id: 'routine-2',
      title: 'Estudo de Programacao',
      description: 'Aprender Angular e TypeScript avancado',
      category: 'Estudos',
      icon: 'ES',
      color: 'var(--purple-neon)',
      frequency: 'daily',
      tasks: [
        {
          id: 'task-2-1',
          routineId: 'routine-2',
          title: 'Ler documentacao',
          completed: true,
          xpReward: 15,
          coinReward: 8,
          order: 1,
          completedDate: new Date(),
        },
        {
          id: 'task-2-2',
          routineId: 'routine-2',
          title: 'Praticar com codigo',
          completed: true,
          xpReward: 25,
          coinReward: 12,
          order: 2,
          completedDate: new Date(),
        },
      ],
      totalXP: 40,
      totalCoins: 20,
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      completionStreak: 7,
      lastCompletedDate: new Date(),
      isCompleted: true,
    },
    {
      id: 'routine-3',
      title: 'Meditacao Guiada',
      description: 'Momento de paz e tranquilidade',
      category: 'Mindfulness',
      icon: 'MI',
      color: '#A78BFA',
      frequency: 'weekly',
      tasks: [
        {
          id: 'task-3-1',
          routineId: 'routine-3',
          title: 'App de meditacao - 20 min',
          completed: false,
          xpReward: 30,
          coinReward: 15,
          order: 1,
        },
        {
          id: 'task-3-2',
          routineId: 'routine-3',
          title: 'Respiracao consciente',
          completed: false,
          xpReward: 15,
          coinReward: 8,
          order: 2,
        },
      ],
      totalXP: 45,
      totalCoins: 23,
      createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      completionStreak: 3,
      lastCompletedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
    {
      id: 'routine-4',
      title: 'Leitura Diaria',
      description: 'Ler capitulos de um livro',
      category: 'Leitura',
      icon: 'LE',
      color: '#F59E0B',
      frequency: 'weekly',
      tasks: [
        {
          id: 'task-4-1',
          routineId: 'routine-4',
          title: 'Ler 30 paginas',
          completed: true,
          xpReward: 20,
          coinReward: 10,
          order: 1,
          completedDate: new Date(),
        },
        {
          id: 'task-4-2',
          routineId: 'routine-4',
          title: 'Anotacoes do livro',
          completed: true,
          xpReward: 15,
          coinReward: 8,
          order: 2,
          completedDate: new Date(),
        },
      ],
      totalXP: 35,
      totalCoins: 18,
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      completionStreak: 2,
      lastCompletedDate: new Date(),
      isCompleted: true,
    },
    {
      id: 'routine-5',
      title: 'Limpeza da Casa',
      description: 'Organizar e limpar ambientes',
      category: 'Casa',
      icon: 'CA',
      color: '#EC4899',
      frequency: 'weekly',
      tasks: [
        {
          id: 'task-5-1',
          routineId: 'routine-5',
          title: 'Limpeza do quarto',
          completed: false,
          xpReward: 25,
          coinReward: 12,
          order: 1,
        },
        {
          id: 'task-5-2',
          routineId: 'routine-5',
          title: 'Organizar mesa de trabalho',
          completed: false,
          xpReward: 15,
          coinReward: 8,
          order: 2,
        },
        {
          id: 'task-5-3',
          routineId: 'routine-5',
          title: 'Lavar roupas',
          completed: false,
          xpReward: 20,
          coinReward: 10,
          order: 3,
        },
      ],
      totalXP: 60,
      totalCoins: 30,
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completionStreak: 1,
      lastCompletedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
    {
      id: 'routine-6',
      title: 'Reuniao com Amigos',
      description: 'Tempo de qualidade com amigos',
      category: 'Social',
      icon: 'SO',
      color: '#10B981',
      frequency: 'monthly',
      tasks: [
        {
          id: 'task-6-1',
          routineId: 'routine-6',
          title: 'Combinar agenda',
          completed: false,
          xpReward: 15,
          coinReward: 8,
          order: 1,
        },
        {
          id: 'task-6-2',
          routineId: 'routine-6',
          title: 'Escolher lugar',
          completed: false,
          xpReward: 10,
          coinReward: 5,
          order: 2,
        },
      ],
      totalXP: 25,
      totalCoins: 13,
      createdDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      completionStreak: 0,
      isCompleted: false,
    },
  ]);

  totalRoutines = computed(() => this.routinesSignal().length);
  completedRoutines = computed(() => this.routinesSignal().filter((routine) => routine.isCompleted).length);
  totalPossibleXP = computed(() =>
    this.routinesSignal().reduce((sum, routine) => sum + routine.totalXP, 0)
  );
  totalPendingTasks = computed(() =>
    this.routinesSignal().reduce(
      (sum, routine) => sum + routine.tasks.filter((task) => !task.completed).length,
      0
    )
  );
  longestStreak = computed(() =>
    this.routinesSignal().reduce(
      (max, routine) => Math.max(max, routine.completionStreak),
      0
    )
  );

  adicionarRotina(rotina: Rotina): Routine {
    const novaRotina = this.mapDomainRoutineToViewModel(rotina);
    this.routinesSignal.update((routines) => [novaRotina, ...routines]);
    return novaRotina;
  }

  updateRoutine(id: string, updates: Partial<Routine>): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine) => (routine.id === id ? { ...routine, ...updates } : routine));
    });
  }

  deleteRoutine(id: string): void {
    this.routinesSignal.update((routines) => routines.filter((routine) => routine.id !== id));
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routinesSignal().find((routine) => routine.id === id);
  }

  getAllRoutines(): Routine[] {
    return this.routinesSignal();
  }

  getRoutinesByFrequency(frequency: Routine['frequency']): Routine[] {
    return this.routinesSignal().filter((routine) => routine.frequency === frequency);
  }

  completeTask(routineId: string, taskId: string): { xp: number; coins: number } {
    let xpGained = 0;
    let coinsGained = 0;

    this.routinesSignal.update((routines) => {
      return routines.map((routine) => {
        if (routine.id === routineId) {
          const updatedTasks = routine.tasks.map((task) => {
            if (task.id === taskId && !task.completed) {
              xpGained = task.xpReward;
              coinsGained = task.coinReward;
              return { ...task, completed: true, completedDate: new Date() };
            }
            return task;
          });

          const allTasksCompleted = updatedTasks.every((task) => task.completed);
          return {
            ...routine,
            tasks: updatedTasks,
            isCompleted: allTasksCompleted,
            lastCompletedDate: allTasksCompleted ? new Date() : routine.lastCompletedDate,
            completionStreak: allTasksCompleted ? routine.completionStreak + 1 : routine.completionStreak,
          };
        }

        return routine;
      });
    });

    return { xp: xpGained, coins: coinsGained };
  }

  uncompleteTask(routineId: string, taskId: string): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine) => {
        if (routine.id === routineId) {
          return {
            ...routine,
            tasks: routine.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: false, completedDate: undefined } : task
            ),
            isCompleted: false,
          };
        }

        return routine;
      });
    });
  }

  addTaskToRoutine(routineId: string, taskData: Omit<Task, 'id' | 'routineId' | 'completed' | 'order'>): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }

        const newTask: Task = {
          ...taskData,
          id: `task-${routineId}-${Date.now()}`,
          routineId,
          completed: false,
          order: routine.tasks.length + 1,
        };

        return {
          ...routine,
          tasks: [...routine.tasks, newTask],
          totalXP: routine.totalXP + newTask.xpReward,
          totalCoins: routine.totalCoins + newTask.coinReward,
        };
      });
    });
  }

  deleteTask(routineId: string, taskId: string): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }

        const updatedTasks = routine.tasks.filter((task) => task.id !== taskId);
        return {
          ...routine,
          tasks: updatedTasks,
          totalXP: updatedTasks.reduce((sum, task) => sum + task.xpReward, 0),
          totalCoins: updatedTasks.reduce((sum, task) => sum + task.coinReward, 0),
          isCompleted: updatedTasks.length > 0 && updatedTasks.every((task) => task.completed),
        };
      });
    });
  }

  private mapDomainRoutineToViewModel(rotina: Rotina): Routine {
    const tema = this.resolveRoutineTheme(rotina.getCategoria());

    return {
      id: rotina.getId(),
      title: rotina.getTitulo(),
      description: rotina.getDescricao(),
      category: rotina.getCategoria(),
      icon: tema.icon,
      color: tema.color,
      frequency: this.mapFrequency(rotina.getFrequencia()),
      tasks: rotina.getTarefas().map((tarefa, index) => ({
        id: tarefa.getId(),
        routineId: rotina.getId(),
        title: tarefa.getTitulo(),
        description: tarefa.getDescricao(),
        completed: tarefa.ehCompleta(),
        xpReward: tarefa.getXPRecompensa(),
        coinReward: tarefa.getMoedasRecompensa(),
        order: index + 1,
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

  private mapFrequency(frequencia: EFrequencia): Routine['frequency'] {
    const map: Record<EFrequencia, Routine['frequency']> = {
      [EFrequencia.DIARIA]: 'daily',
      [EFrequencia.SEMANAL]: 'weekly',
      [EFrequencia.MENSAL]: 'monthly',
    };

    return map[frequencia];
  }

  private resolveRoutineTheme(categoria: string): { icon: string; color: string } {
    const normalizada = categoria.trim().toLowerCase();

    const themes: Record<string, { icon: string; color: string }> = {
      saude: { icon: 'SA', color: 'var(--game-success)' },
      estudos: { icon: 'ES', color: 'var(--purple-neon)' },
      trabalho: { icon: 'TR', color: '#60A5FA' },
      casa: { icon: 'CA', color: '#F59E0B' },
      social: { icon: 'SO', color: '#EC4899' },
      mindfulness: { icon: 'MI', color: '#A78BFA' },
      lazer: { icon: 'LA', color: '#22C55E' },
      leitura: { icon: 'LE', color: '#F97316' },
    };

    return themes[normalizada] ?? { icon: 'RT', color: 'var(--purple-primary)' };
  }
}

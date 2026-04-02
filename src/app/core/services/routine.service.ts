import { Injectable, signal, computed } from '@angular/core';

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
  order: number; // Para ordenação
}

/**
 * Interface de Rotina
 */
export interface Routine {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji ou ícone
  color: string; // cor da rotina (brand-neon, game-xp, etc)
  frequency: 'daily' | 'weekly' | 'monthly'; // Frequência
  tasks: Task[]; // Tarefas da rotina
  totalXP: number; // XP total ao completar
  totalCoins: number; // Moedas ao completar
  createdDate: Date;
  completionStreak: number; // Quantos dias seguidos completou
  lastCompletedDate?: Date;
  isCompleted: boolean; // Se foi completa hoje/esta semana/mês
}

/**
 * RoutineService: CRUD de rotinas e tarefas
 * Gerencia lista de rotinas do usuário
 */
@Injectable({ providedIn: 'root' })
export class RoutineService {
  // ───────────────────────────────────────────────────────────────
  // 🎮 SIGNALS
  // ───────────────────────────────────────────────────────────────

  /**
   * Lista de rotinas do usuário
   */
  routinesSignal = signal<Routine[]>([
    // 💪 ROTINA 1: EXERCÍCIO MATINAL (DAILY - EM ANDAMENTO)
    {
      id: 'routine-1',
      title: 'Exercício Matinal',
      description: 'Treino de 30 minutos com foco em resistência',
      icon: '💪',
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
          title: 'Musculação',
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
    // 💻 ROTINA 2: ESTUDO DE PROGRAMAÇÃO (DAILY - COMPLETA)
    {
      id: 'routine-2',
      title: 'Estudo de Programação',
      description: 'Aprender Angular e TypeScript avançado',
      icon: '💻',
      color: 'var(--brand-neon)',
      frequency: 'daily',
      tasks: [
        {
          id: 'task-2-1',
          routineId: 'routine-2',
          title: 'Ler documentação',
          completed: true,
          xpReward: 15,
          coinReward: 8,
          order: 1,
          completedDate: new Date(),
        },
        {
          id: 'task-2-2',
          routineId: 'routine-2',
          title: 'Praticar com código',
          completed: true,
          xpReward: 25,
          coinReward: 12,
          completedDate: new Date(),
          order: 2,
        },
      ],
      totalXP: 40,
      totalCoins: 20,
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      completionStreak: 7,
      lastCompletedDate: new Date(),
      isCompleted: true,
    },
    // 🧘 ROTINA 3: MEDITAÇÃO E MINDFULNESS (WEEKLY)
    {
      id: 'routine-3',
      title: 'Meditação Guiada',
      description: 'Momento de paz e tranquilidade',
      icon: '🧘',
      color: '#A78BFA',
      frequency: 'weekly',
      tasks: [
        {
          id: 'task-3-1',
          routineId: 'routine-3',
          title: 'App de meditação - 20 min',
          completed: false,
          xpReward: 30,
          coinReward: 15,
          order: 1,
        },
        {
          id: 'task-3-2',
          routineId: 'routine-3',
          title: 'Respiração consciente',
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
    // 📚 ROTINA 4: LEITURA (WEEKLY - COMPLETA)
    {
      id: 'routine-4',
      title: 'Leitura Diária',
      description: 'Ler capítulos de um livro',
      icon: '📚',
      color: '#F59E0B',
      frequency: 'weekly',
      tasks: [
        {
          id: 'task-4-1',
          routineId: 'routine-4',
          title: 'Ler 30 páginas',
          completed: true,
          xpReward: 20,
          coinReward: 10,
          order: 1,
          completedDate: new Date(),
        },
        {
          id: 'task-4-2',
          routineId: 'routine-4',
          title: 'Anotações do livro',
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
    // 🧹 ROTINA 5: LIMPEZA DO ESPAÇO (WEEKLY)
    {
      id: 'routine-5',
      title: 'Limpeza da Casa',
      description: 'Organizar e limpar ambientes',
      icon: '🧹',
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
    // 👥 ROTINA 6: SOCIAL (MONTHLY)
    {
      id: 'routine-6',
      title: 'Reunião com Amigos',
      description: 'Tempo de qualidade com amigos',
      icon: '👥',
      color: '#10B981',
      frequency: 'monthly',
      tasks: [
        {
          id: 'task-6-1',
          routineId: 'routine-6',
          title: 'Planejamento do encontro',
          completed: true,
          xpReward: 10,
          coinReward: 5,
          order: 1,
          completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'task-6-2',
          routineId: 'routine-6',
          title: 'Encontro (2+ horas)',
          completed: true,
          xpReward: 50,
          coinReward: 25,
          order: 2,
          completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'task-6-3',
          routineId: 'routine-6',
          title: 'Acompanhamento pós',
          completed: true,
          xpReward: 20,
          coinReward: 10,
          order: 3,
          completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
      ],
      totalXP: 80,
      totalCoins: 40,
      createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      completionStreak: 1,
      lastCompletedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isCompleted: true,
    },
  ]);

  // ───────────────────────────────────────────────────────────────
  // 📊 COMPUTED
  // ───────────────────────────────────────────────────────────────

  /**
   * Total de rotinas
   */
  totalRoutines = computed(() => this.routinesSignal().length);

  /**
   * Rotinas completas hoje
   */
  completedRoutines = computed(() => {
    return this.routinesSignal().filter((r) => r.isCompleted).length;
  });

  /**
   * Total de XP possível (todas as rotinas) 
   */
  totalPossibleXP = computed(() => {
    return this.routinesSignal().reduce((sum, r) => sum + r.totalXP, 0);
  });

  /**
   * Total de tarefas incompletas
   */
  totalPendingTasks = computed(() => {
    return this.routinesSignal().reduce((sum, r) => {
      return sum + r.tasks.filter((t) => !t.completed).length;
    }, 0);
  });

  /**
   * Streak maior (maior sequência de dias)
   */
  longestStreak = computed(() => {
    const streaks = this.routinesSignal().map((r) => r.completionStreak);
    return streaks.length > 0 ? Math.max(...streaks) : 0;
  });

  // ───────────────────────────────────────────────────────────────
  // 🎯 ROUTINE METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Criar nova rotina
   */
  createRoutine(routineData: Omit<Routine, 'id' | 'createdDate' | 'completionStreak' | 'isCompleted'>): Routine {
    const newRoutine: Routine = {
      ...routineData,
      id: `routine-${Date.now()}`,
      createdDate: new Date(),
      completionStreak: 0,
      isCompleted: false,
    };

    this.routinesSignal.update((routines) => [...routines, newRoutine]);
    console.log(`✅ Rotina criada: ${newRoutine.title}`);
    return newRoutine;
  }

  /**
   * Atualizar rotina
   */
  updateRoutine(id: string, updates: Partial<Routine>): void {
    this.routinesSignal.update((routines) => {
      return routines.map((r: Routine) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          console.log(`✏️ Rotina atualizada: ${updated.title}`);
          return updated;
        }
        return r;
      });
    });
  }

  /**
   * Deletar rotina
   */
  deleteRoutine(id: string): void {
    this.routinesSignal.update((routines) => routines.filter((r: Routine) => r.id !== id));
    console.log(`🗑️ Rotina deletada`);
  }

  /**
   * Pega rotina por ID
   */
  getRoutineById(id: string): Routine | undefined {
    return this.routinesSignal().find((r) => r.id === id);
  }

  /**
   * Pega todas as rotinas
   */
  getAllRoutines(): Routine[] {
    return this.routinesSignal();
  }

  /**
   * Filtra rotinas por frequência
   */
  getRoutinesByFrequency(frequency: Routine['frequency']): Routine[] {
    return this.routinesSignal().filter((r) => r.frequency === frequency);
  }

  // ───────────────────────────────────────────────────────────────
  // ✅ TASK METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Marca tarefa como concluída
   */
  completeTask(routineId: string, taskId: string): { xp: number; coins: number } {
    let xpGained = 0;
    let coinsGained = 0;

    this.routinesSignal.update((routines) => {
      return routines.map((routine: Routine) => {
        if (routine.id === routineId) {
          const updatedTasks = routine.tasks.map((task: Task) => {
            if (task.id === taskId && !task.completed) {
              xpGained = task.xpReward;
              coinsGained = task.coinReward;
              return { ...task, completed: true, completedDate: new Date() };
            }
            return task;
          });
          const allTasksCompleted = updatedTasks.every((t: Task) => t.completed);
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

  /**
   * Desmarcar tarefa
   */
  uncompleteTask(routineId: string, taskId: string): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine: Routine) => {
        if (routine.id === routineId) {
          return {
            ...routine,
            tasks: routine.tasks.map((task: Task) => {
              if (task.id === taskId) {
                console.log(`↩️ Tarefa desmarcada`);
                return { ...task, completed: false, completedDate: undefined };
              }
              return task;
            }),
            isCompleted: false,
          };
        }
        return routine;
      });
    });
  }

  /**
   * Adicionar tarefa a uma rotina
   */
  addTaskToRoutine(routineId: string, taskData: Omit<Task, 'id' | 'routineId' | 'completed' | 'order'>): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine: Routine) => {
        if (routine.id === routineId) {
          const newTask: Task = {
            ...taskData,
            id: `task-${routineId}-${Date.now()}`,
            routineId,
            completed: false,
            order: routine.tasks.length + 1,
          };
          console.log(`➕ Tarefa adicionada: ${newTask.title}`);
          return {
            ...routine,
            tasks: [...routine.tasks, newTask],
            totalXP: routine.totalXP + taskData.xpReward,
            totalCoins: routine.totalCoins + taskData.coinReward,
          };
        }
        return routine;
      });
    });
  }

  /**
   * Deletar tarefa
   */
  deleteTask(routineId: string, taskId: string): void {
    this.routinesSignal.update((routines) => {
      return routines.map((routine: Routine) => {
        if (routine.id === routineId) {
          const taskToDelete = routine.tasks.find((t: Task) => t.id === taskId);
          if (taskToDelete) {
            console.log(`🗑️ Tarefa deletada`);
            return {
              ...routine,
              tasks: routine.tasks.filter((t: Task) => t.id !== taskId),
              totalXP: routine.totalXP - taskToDelete.xpReward,
              totalCoins: routine.totalCoins - taskToDelete.coinReward,
            };
          }
        }
        return routine;
      });
    });
  }

  /**
   * Pega uma tarefa específica
   */
  getTask(routineId: string, taskId: string): Task | undefined {
    const routine = this.getRoutineById(routineId);
    return routine?.tasks.find((t) => t.id === taskId);
  }

  /**
   * Reset completo (para desenvolvimento)
   */
  resetRoutines(): void {
    this.routinesSignal.set([]);
  }
}

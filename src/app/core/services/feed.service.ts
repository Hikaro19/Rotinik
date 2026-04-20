import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface SharedRoutine {
  id: string;
  routineId: string;
  routineName: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'fitness' | 'learning' | 'other';
  sharedBy: {
    id: string;
    username: string;
    avatar: string;
    level: number;
  };
  description: string;
  completionStats: {
    streakDays: number;
    totalCompleted: number;
    successRate: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  estimatedTime: number; // in minutes per day
  shares: number;
  likes: number;
  isLiked: boolean;
  sharedAt: Date;
  tasks?: string[];
}

export interface FeedPage {
  routines: SharedRoutine[];
  hasMore: boolean;
  pageIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private mockRoutines: SharedRoutine[] = [
    {
      id: 'feed-1',
      routineId: 'routine-morning',
      routineName: '🌅 Manhã Produtiva',
      category: 'productivity',
      sharedBy: {
        id: 'user-lendario',
        username: 'Lendário',
        avatar: '👑',
        level: 35,
      },
      description: 'Rotina completa de manhã: meditação, exercício e planejamento do dia',
      completionStats: {
        streakDays: 87,
        totalCompleted: 156,
        successRate: 92,
      },
      difficulty: 'hard',
      duration: 45,
      estimatedTime: 45,
      shares: 234,
      likes: 1205,
      isLiked: false,
      sharedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      tasks: ['Meditação 10min', 'Exercício 20min', 'Planejamento 15min'],
    },
    {
      id: 'feed-2',
      routineId: 'routine-fitness',
      routineName: '💪 Treino Rápido',
      category: 'fitness',
      sharedBy: {
        id: 'user-speed-runner',
        username: 'Speed Runner',
        avatar: '⚡',
        level: 28,
      },
      description: 'HIIT rápido para manter a forma sem perder tempo',
      completionStats: {
        streakDays: 45,
        totalCompleted: 89,
        successRate: 88,
      },
      difficulty: 'hard',
      duration: 30,
      estimatedTime: 30,
      shares: 189,
      likes: 856,
      isLiked: false,
      sharedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
      tasks: ['Aquecimento 5min', 'HIIT 20min', 'Resfriamento 5min'],
    },
    {
      id: 'feed-3',
      routineId: 'routine-mindfulness',
      routineName: '🧘 Zen Matinal',
      category: 'mindfulness',
      sharedBy: {
        id: 'user-consistent',
        username: 'Consistência Pro',
        avatar: '🎯',
        level: 31,
      },
      description: 'Meditação e respiração para começar o dia com calma e foco',
      completionStats: {
        streakDays: 156,
        totalCompleted: 234,
        successRate: 95,
      },
      difficulty: 'easy',
      duration: 20,
      estimatedTime: 20,
      shares: 412,
      likes: 2341,
      isLiked: true,
      sharedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
      tasks: ['Respiração 5min', 'Meditação 15min'],
    },
    {
      id: 'feed-4',
      routineId: 'routine-learning',
      routineName: '📚 Hábito de Estudo',
      category: 'learning',
      sharedBy: {
        id: 'user-scholar',
        username: 'Scholar',
        avatar: '📖',
        level: 26,
      },
      description: 'Estude um novo tópico diariamente com flashcards',
      completionStats: {
        streakDays: 52,
        totalCompleted: 78,
        successRate: 82,
      },
      difficulty: 'medium',
      duration: 40,
      estimatedTime: 40,
      shares: 156,
      likes: 645,
      isLiked: false,
      sharedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
      tasks: ['Leitura 20min', 'Flashcards 20min'],
    },
    {
      id: 'feed-5',
      routineId: 'routine-health',
      routineName: '🥗 Nutrição Diária',
      category: 'health',
      sharedBy: {
        id: 'user-nutritionist',
        username: 'Nutritionist',
        avatar: '👨‍⚕️',
        level: 29,
      },
      description: 'Beba água, coma vegetais e controle porções',
      completionStats: {
        streakDays: 123,
        totalCompleted: 178,
        successRate: 90,
      },
      difficulty: 'easy',
      duration: 15,
      estimatedTime: 15,
      shares: 298,
      likes: 1123,
      isLiked: false,
      sharedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10h ago
      tasks: ['Água 2L+', 'Vegetais 3 porções', 'Proteína 100g'],
    },
    {
      id: 'feed-6',
      routineId: 'routine-evening',
      routineName: '🌙 Noite Relaxante',
      category: 'mindfulness',
      sharedBy: {
        id: 'user-sleeper',
        username: 'Sleep Master',
        avatar: '😴',
        level: 24,
      },
      description: 'Prepare-se para uma noite de sono de qualidade',
      completionStats: {
        streakDays: 78,
        totalCompleted: 112,
        successRate: 85,
      },
      difficulty: 'easy',
      duration: 25,
      estimatedTime: 25,
      shares: 234,
      likes: 987,
      isLiked: false,
      sharedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
      tasks: ['Desligar telas 15min', 'Chá relaxante', 'Leitura leve'],
    },
  ];

  // Signals
  feedRoutinesSignal = signal<SharedRoutine[]>([]);
  currentPageSignal = signal(0);
  isLoadingMoreSignal = signal(false);
  hasMoreRoutinesSignal = signal(true);

  // Computed
  totalRoutinesLoaded = computed(() => this.feedRoutinesSignal().length);

  constructor() {
    this.loadInitialFeed();
  }

  private loadInitialFeed(): void {
    const initialRoutines = this.mockRoutines.slice(0, 3);
    this.feedRoutinesSignal.set(initialRoutines);
    this.currentPageSignal.set(1);
  }

  // Load more routines for infinite scroll
  loadMoreRoutines(): Promise<void> {
    return new Promise((resolve) => {
      this.isLoadingMoreSignal.set(true);

      // Simulate network delay
      setTimeout(() => {
        const currentPage = this.currentPageSignal();
        const startIndex = currentPage * 3;
        const endIndex = startIndex + 3;

        if (startIndex < this.mockRoutines.length) {
          const newRoutines = [
            ...this.feedRoutinesSignal(),
            ...this.mockRoutines.slice(startIndex, endIndex),
          ];
          this.feedRoutinesSignal.set(newRoutines);
          this.currentPageSignal.set(currentPage + 1);

          // Check if there are more routines
          if (endIndex >= this.mockRoutines.length) {
            this.hasMoreRoutinesSignal.set(false);
          }
        } else {
          this.hasMoreRoutinesSignal.set(false);
        }

        this.isLoadingMoreSignal.set(false);
        resolve();
      }, 600);
    });
  }

  // Like/Unlike actions
  toggleLike(routineId: string): void {
    const routines = this.feedRoutinesSignal();
    const updatedRoutines = routines.map((routine) => {
      if (routine.id === routineId) {
        return {
          ...routine,
          isLiked: !routine.isLiked,
          likes: routine.isLiked ? routine.likes - 1 : routine.likes + 1,
        };
      }
      return routine;
    });
    this.feedRoutinesSignal.set(updatedRoutines);
  }

  // Copy Routine action
  copyRoutine(routineId: string): Promise<void> {
    return new Promise((resolve) => {
      // Simulate API call to add routine to user's list
      setTimeout(() => {
        const routine = this.mockRoutines.find((r) => r.id === routineId);
        if (routine) {
          // In a real app, this would be saved to the user's routine list
          console.log(`Rotina "${routine.routineName}" copiada com sucesso`);
        }
        resolve();
      }, 500);
    });
  }

  // Get all routines (for testing/admin)
  getAllRoutines(): SharedRoutine[] {
    return [...this.mockRoutines];
  }

  // Get routine by ID
  getRoutineById(id: string): SharedRoutine | undefined {
    return this.mockRoutines.find((r) => r.id === id);
  }

  // Search routines
  searchRoutines(query: string): SharedRoutine[] {
    const lowercaseQuery = query.toLowerCase();
    return this.mockRoutines.filter(
      (routine) =>
        routine.routineName.toLowerCase().includes(lowercaseQuery) ||
        routine.description.toLowerCase().includes(lowercaseQuery) ||
        routine.sharedBy.username.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get routines by category
  getRoutinesByCategory(category: string): SharedRoutine[] {
    return this.mockRoutines.filter((r) => r.category === category);
  }
}

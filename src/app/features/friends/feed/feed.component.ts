import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService, SharedRoutine } from '@core/services/feed.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppCardComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSpinnerComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  feedService = inject(FeedService);

  // Signals
  searchQuerySignal = signal('');
  searchQueryText = '';
  filteredRoutinesSignal = signal<SharedRoutine[]>([]);
  isLoadingMoreSignal = this.feedService.isLoadingMoreSignal;
  hasMoreRoutinesSignal = this.feedService.hasMoreRoutinesSignal;
  selectedCategorySignal = signal<string | null>(null);

  // Computed
  routineCategories = [
    { id: 'health', name: '❤️ Saúde', emoji: '❤️' },
    { id: 'productivity', name: '⚡ Produtividade', emoji: '⚡' },
    { id: 'mindfulness', name: '🧘 Mindfulness', emoji: '🧘' },
    { id: 'fitness', name: '💪 Fitness', emoji: '💪' },
    { id: 'learning', name: '📚 Aprendizado', emoji: '📚' },
    { id: 'other', name: '🌟 Outros', emoji: '🌟' },
  ];

  ngOnInit(): void {
    this.updateFilteredRoutines();
  }

  updateFilteredRoutines(): void {
    const query = this.searchQuerySignal();
    const category = this.selectedCategorySignal();

    let routines = this.feedService.feedRoutinesSignal();

    // Filter by category
    if (category) {
      routines = routines.filter((r) => r.category === category);
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      routines = routines.filter(
        (r) =>
          r.routineName.toLowerCase().includes(lowercaseQuery) ||
          r.description.toLowerCase().includes(lowercaseQuery) ||
          r.sharedBy.username.toLowerCase().includes(lowercaseQuery)
      );
    }

    this.filteredRoutinesSignal.set(routines);
  }

  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
    this.updateFilteredRoutines();
  }

  onCategoryClick(categoryId: string): void {
    this.selectedCategorySignal.update((current) =>
      current === categoryId ? null : categoryId
    );
    this.updateFilteredRoutines();
  }

  onLoadMore(): void {
    if (!this.isLoadingMoreSignal() && this.hasMoreRoutinesSignal()) {
      this.feedService.loadMoreRoutines().then(() => {
        this.updateFilteredRoutines();
      });
    }
  }

  onLikeClick(routine: SharedRoutine): void {
    this.feedService.toggleLike(routine.id);
    this.updateFilteredRoutines();
  }

  onCopyRoutine(routine: SharedRoutine): void {
    this.feedService.copyRoutine(routine.id).then(() => {
      // In a real app, show a toast notification
      alert(`✓ Rotina "${routine.routineName}" adicionada à sua lista!`);
    });
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR');
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return '#4ade80'; // green
      case 'medium':
        return '#fbbf24'; // amber
      case 'hard':
        return '#f87171'; // red
      default:
        return '#9ca3af'; // gray
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  }

  getCategoryEmoji(category: string): string {
    const cat = this.routineCategories.find((c) => c.id === category);
    return cat ? cat.emoji : '🌟';
  }
}

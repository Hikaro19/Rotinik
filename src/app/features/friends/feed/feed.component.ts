import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedFacadeService } from '@core/services/feed-facade.service';
import { SharedRoutine } from '@core/services/feed.service';
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
  feedFacade = inject(FeedFacadeService);

  searchQuerySignal = signal('');
  searchQueryText = '';
  filteredRoutinesSignal = signal<SharedRoutine[]>([]);
  isLoadingMoreSignal = this.feedFacade.isLoadingMore;
  hasMoreRoutinesSignal = this.feedFacade.hasMoreRoutines;
  selectedCategorySignal = signal<string | null>(null);

  routineCategories = [
    { id: 'health', name: 'Saude', emoji: '❤️' },
    { id: 'productivity', name: 'Produtividade', emoji: '⚡' },
    { id: 'mindfulness', name: 'Mindfulness', emoji: '🧘' },
    { id: 'fitness', name: 'Fitness', emoji: '💪' },
    { id: 'learning', name: 'Aprendizado', emoji: '📚' },
    { id: 'other', name: 'Outros', emoji: '🌟' },
  ];

  ngOnInit(): void {
    this.updateFilteredRoutines();
  }

  updateFilteredRoutines(): void {
    this.filteredRoutinesSignal.set(
      this.feedFacade.filteredRoutines(this.searchQuerySignal(), this.selectedCategorySignal()),
    );
  }

  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
    this.updateFilteredRoutines();
  }

  onCategoryClick(categoryId: string): void {
    this.selectedCategorySignal.update((current) => (current === categoryId ? null : categoryId));
    this.updateFilteredRoutines();
  }

  onLoadMore(): void {
    if (!this.isLoadingMoreSignal() && this.hasMoreRoutinesSignal()) {
      this.feedFacade.loadMoreRoutines().then(() => this.updateFilteredRoutines());
    }
  }

  onLikeClick(routine: SharedRoutine): void {
    this.feedFacade.toggleLike(routine.id);
    this.updateFilteredRoutines();
  }

  onCopyRoutine(routine: SharedRoutine): void {
    this.feedFacade.copyRoutine(routine.id).then(() => {
      alert(`Rotina "${routine.routineName}" adicionada a sua lista!`);
    });
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atras`;
    if (diffHours < 24) return `${diffHours}h atras`;
    if (diffDays < 7) return `${diffDays}d atras`;

    return date.toLocaleDateString('pt-BR');
  }

  getDifficultyTone(difficulty: string): 'easy' | 'medium' | 'hard' | 'default' {
    switch (difficulty) {
      case 'easy':
      case 'medium':
      case 'hard':
        return difficulty;
      default:
        return 'default';
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'Facil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Dificil';
      default:
        return difficulty;
    }
  }

  getCategoryEmoji(category: string): string {
    const cat = this.routineCategories.find((entry) => entry.id === category);
    return cat ? cat.emoji : '🌟';
  }
}

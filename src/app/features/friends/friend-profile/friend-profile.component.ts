import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/services/user.service';
import { SocialFacadeService } from '@core/services/social-facade.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';
import { AppSectionPanelComponent } from '@shared/components/ui/section-panel/section-panel.component';

@Component({
  selector: 'app-friend-profile',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppButtonComponent, AppSpinnerComponent, AppSectionPanelComponent],
  templateUrl: './friend-profile.component.html',
  styleUrl: './friend-profile.component.scss',
})
export class FriendProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private socialFacade = inject(SocialFacadeService);

  userSignal = signal<User | null>(null);
  loadingSignal = signal(true);

  isFriend = computed(() => {
    const user = this.userSignal();
    return user !== null && this.socialFacade.isFriend(user.id);
  });

  pendingRequest = computed(() => {
    const user = this.userSignal();
    return user !== null ? this.socialFacade.pendingRequestStatus(user.id) : null;
  });

  isCurrentUser = computed(() => {
    const user = this.userSignal();
    return user !== null && this.socialFacade.isCurrentUser(user.id);
  });

  mockAchievements = [
    {
      id: 'ach-1',
      name: 'Streaker',
      description: '7 dias de streak',
      icon: '🔥',
      rarity: 'rare' as const,
      unlockedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-2',
      name: 'Elite',
      description: 'Alcancou nivel 25',
      icon: '👑',
      rarity: 'epic' as const,
      unlockedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-3',
      name: 'Social',
      description: '10 amigos',
      icon: '👥',
      rarity: 'common' as const,
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  mockActivityDays = computed(() => {
    const days = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        completed: Math.random() > 0.5,
      });
    }

    return days;
  });

  activityPercentage = computed(() => {
    const total = this.mockActivityDays().length;
    const active = this.mockActivityDays().filter((day) => day.completed).length;
    return Math.round((active / total) * 100);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        this.loadUserProfile(userId);
      } else {
        this.router.navigate(['/friends']);
      }
    });
  }

  private loadUserProfile(userId: string): void {
    this.loadingSignal.set(true);

    setTimeout(() => {
      const user = this.socialFacade.getUserById(userId);
      if (user) {
        this.userSignal.set(user);
      } else {
        this.router.navigate(['/friends']);
      }
      this.loadingSignal.set(false);
    }, 300);
  }

  sendFriendRequest(): void {
    const user = this.userSignal();
    if (user) {
      this.socialFacade.sendFriendRequest(user.id, user.name, user.avatar);
    }
  }

  acceptRequest(): void {
    const user = this.userSignal();
    if (user) {
      this.socialFacade.acceptPendingRequestForUser(user);
    }
  }

  removeFriend(): void {
    const user = this.userSignal();
    if (user && confirm('Tem certeza que deseja remover este amigo?')) {
      this.socialFacade.removeFriend(user.id);
    }
  }

  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: '#888',
      rare: '#4169e1',
      epic: '#9932cc',
      legendary: '#ffd700',
    };
    return colors[rarity] || '#888';
  }

  translateRarity(rarity: string): string {
    const translations: Record<string, string> = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Epico',
      legendary: 'Lendario',
    };
    return translations[rarity] || rarity;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  goBack(): void {
    this.router.navigate(['/friends']);
  }

  getWeeksArray(): number[] {
    const totalDays = this.mockActivityDays().length;
    const totalWeeks = Math.ceil(totalDays / 7);
    return Array.from({ length: totalWeeks }, (_, index) => index);
  }

  getTodayDate(): Date {
    return new Date();
  }
}

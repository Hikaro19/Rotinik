import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '@core/services/user.service';
import { FriendsService } from '@core/services/friends.service';
import { ProfileService } from '@core/services/profile.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';
import { signal, computed } from '@angular/core';

/**
 * FriendProfileComponent: Read-only public profile view
 * Mostra perfil de outro usuário com opções de amizade
 */
@Component({
  selector: 'app-friend-profile',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppButtonComponent, AppSpinnerComponent],
  templateUrl: './friend-profile.component.html',
  styleUrl: './friend-profile.component.scss',
})
export class FriendProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private friendsService = inject(FriendsService);
  private profileService = inject(ProfileService);

  // Sinal do usuário exibido
  userSignal = signal<User | null>(null);
  loadingSignal = signal(true);

  // Computed para status de amizade
  isFriend = computed(() => {
    const user = this.userSignal();
    return user !== null && this.friendsService.isFriend(user.id);
  });

  pendingRequest = computed(() => {
    const user = this.userSignal();
    return user !== null ? this.friendsService.hasPendingRequest(user.id) : null;
  });

  isCurrentUser = computed(() => {
    const user = this.userSignal();
    return user !== null && user.id === this.userService.currentUserSignal().id;
  });

  // Mock achievements para o usuário
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
      description: 'Alcançou nível 25',
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

  // Mock activity (similar ao profile)
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
    const active = this.mockActivityDays().filter((d) => d.completed).length;
    return Math.round((active / total) * 100);
  });

  ngOnInit(): void {
    // Get user ID from route params
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        this.loadUserProfile(userId);
      } else {
        this.router.navigate(['/friends']);
      }
    });
  }

  /**
   * Carregar perfil do usuário
   */
  private loadUserProfile(userId: string): void {
    this.loadingSignal.set(true);
    // Simular delay de loading
    setTimeout(() => {
      const user = this.userService.getUserById(userId);
      if (user) {
        this.userSignal.set(user);
      } else {
        this.router.navigate(['/friends']);
      }
      this.loadingSignal.set(false);
    }, 300);
  }

  /**
   * Enviar requisição de amizade
   */
  sendFriendRequest(): void {
    const user = this.userSignal();
    if (user) {
      this.friendsService.sendFriendRequest(user.id, user.name, user.avatar);
    }
  }

  /**
   * Aceitar requisição
   */
  acceptRequest(): void {
    const user = this.userSignal();
    if (user) {
      const request = this.friendsService.getAllRequests().find((r) => r.senderId === user.id);
      if (request) {
        this.friendsService.acceptFriendRequest(request.id, user.id, user.name, user.avatar);
      }
    }
  }

  /**
   * Remover amigo
   */
  removeFriend(): void {
    const user = this.userSignal();
    if (user && confirm('Tem certeza que deseja remover este amigo?')) {
      this.friendsService.removeFriend(user.id);
    }
  }

  /**
   * Obter ícone para raridade
   */
  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: '#888',
      rare: '#4169e1',
      epic: '#9932cc',
      legendary: '#ffd700',
    };
    return colors[rarity] || '#888';
  }

  /**
   * Traduzir raridade
   */
  translateRarity(rarity: string): string {
    const translations: Record<string, string> = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário',
    };
    return translations[rarity] || rarity;
  }

  /**
   * Formatar data
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Voltar
   */
  goBack(): void {
    this.router.navigate(['/friends']);
  }

  /**
   * Gerar array de semanas para o heatmap
   */
  getWeeksArray(): number[] {
    const totalDays = this.mockActivityDays().length;
    const totalWeeks = Math.ceil(totalDays / 7);
    return Array.from({ length: totalWeeks }, (_, i) => i);
  }

  /**
   * Obter data padrão (data de hoje)
   */
  getTodayDate(): Date {
    return new Date();
  }
}


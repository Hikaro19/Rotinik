import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { FriendsService } from '@core/services/friends.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

type TabType = 'friends' | 'requests' | 'discover';

/**
 * FriendsComponent: Hub de amigos
 * Gerencia lista de amigos, requisições e descoberta de novos usuários
 */
@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule, AppCardComponent, AppButtonComponent, AppInputComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  private router = inject(Router);
  userService = inject(UserService);
  friendsService = inject(FriendsService);

  // Tab ativo
  activeTabSignal = signal<TabType>('friends');

  // Busca para descoberta
  searchQuerySignal = signal<string>('');
  searchQueryText = '';

  // Amigos para exibição
  friendsList = this.friendsService.friendsList;
  receivedRequests = this.friendsService.receivedRequests;
  sentRequests = this.friendsService.sentRequests;
  favoriteFriends = this.friendsService.favoriteFriends;
  totalFriends = this.friendsService.totalFriends;
  pendingCount = this.friendsService.pendingRequestsCount;

  /**
   * Mudar aba ativa
   */
  setActiveTab(tab: TabType): void {
    this.activeTabSignal.set(tab);
  }

  /**
   * Atualizar query de busca
   */
  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
  }

  /**
   * Obter usuários sugeridos (não são amigos)
   */
  getSuggestedUsers() {
    const query = this.searchQuerySignal();
    const friendIds = this.friendsList().map((f) => f.friendId);
    const sentRequestIds = this.sentRequests().map((r) => r.receiverId);
    const allUserIds = [...friendIds, ...sentRequestIds, 'user-current'];

    let users = this.userService.getAllUsers();

    if (query) {
      users = users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.bio?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return users.filter((u) => !allUserIds.includes(u.id));
  }

  /**
   * Enviar requisição de amizade
   */
  sendFriendRequest(userId: string, userName: string, userAvatar: string): void {
    this.friendsService.sendFriendRequest(userId, userName, userAvatar);
  }

  /**
   * Aceitar requisição
   */
  acceptRequest(requestId: string, senderId: string, senderName: string, senderAvatar: string): void {
    this.friendsService.acceptFriendRequest(requestId, senderId, senderName, senderAvatar);
  }

  /**
   * Recusar requisição
   */
  declineRequest(requestId: string): void {
    this.friendsService.declineFriendRequest(requestId);
  }

  /**
   * Cancelar requisição enviada
   */
  cancelRequest(requestId: string): void {
    this.friendsService.cancelSentRequest(requestId);
  }

  /**
   * Remover amigo
   */
  removeFriend(friendId: string): void {
    if (confirm('Tem certeza que deseja remover este amigo?')) {
      this.friendsService.removeFriend(friendId);
    }
  }

  /**
   * Marcar/desmarcar como favorito
   */
  toggleFavorite(friendId: string): void {
    this.friendsService.toggleFavorite(friendId);
  }

  /**
   * Navegar para perfil
   */
  goToProfile(userId: string): void {
    this.router.navigate(['/friends/profile', userId]);
  }

  /**
   * Verificar status online
   */
  isOnline(lastOnline: Date): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastOnline > fiveMinutesAgo;
  }

  /**
   * Formatar tempo desde último online
   */
  formatLastOnline(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Online agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Formatar data de requisição
   */
  formatRequestDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Obter status do botão de ação
   */
  getActionButtonText(userId: string): string {
    if (this.friendsService.isFriend(userId)) return 'Amigo';

    const pendingStatus = this.friendsService.hasPendingRequest(userId);
    if (pendingStatus === 'sent') return 'Requisição Enviada';
    if (pendingStatus === 'received') return 'Aceitar';

    return 'Adicionar';
  }
}

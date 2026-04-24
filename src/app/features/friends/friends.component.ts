import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialFacadeService } from '@core/services/social-facade.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppInputComponent } from '@shared/components/ui/input/input.component';

type TabType = 'friends' | 'requests' | 'discover';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule, AppCardComponent, AppButtonComponent, AppInputComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  private router = inject(Router);
  socialFacade = inject(SocialFacadeService);

  activeTabSignal = signal<TabType>('friends');
  searchQuerySignal = signal<string>('');
  searchQueryText = '';

  friendsList = this.socialFacade.friendsList;
  receivedRequests = this.socialFacade.receivedRequests;
  sentRequests = this.socialFacade.sentRequests;
  favoriteFriends = this.socialFacade.favoriteFriends;
  totalFriends = this.socialFacade.totalFriends;
  pendingCount = this.socialFacade.pendingCount;

  setActiveTab(tab: TabType): void {
    this.activeTabSignal.set(tab);
  }

  onSearchChange(value: string): void {
    this.searchQueryText = value;
    this.searchQuerySignal.set(value);
  }

  getSuggestedUsers() {
    return this.socialFacade.suggestedUsers(this.searchQuerySignal());
  }

  sendFriendRequest(userId: string, userName: string, userAvatar: string): void {
    this.socialFacade.sendFriendRequest(userId, userName, userAvatar);
  }

  acceptRequest(requestId: string, senderId: string, senderName: string, senderAvatar: string): void {
    this.socialFacade.acceptFriendRequest(requestId, senderId, senderName, senderAvatar);
  }

  declineRequest(requestId: string): void {
    this.socialFacade.declineFriendRequest(requestId);
  }

  cancelRequest(requestId: string): void {
    this.socialFacade.cancelSentRequest(requestId);
  }

  removeFriend(friendId: string): void {
    if (confirm('Tem certeza que deseja remover este amigo?')) {
      this.socialFacade.removeFriend(friendId);
    }
  }

  toggleFavorite(friendId: string): void {
    this.socialFacade.toggleFavorite(friendId);
  }

  goToProfile(userId: string): void {
    this.router.navigate(['/friends/profile', userId]);
  }

  isOnline(lastOnline: Date): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastOnline > fiveMinutesAgo;
  }

  formatLastOnline(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Online agora';
    if (minutes < 60) return `${minutes}m atras`;
    if (hours < 24) return `${hours}h atras`;
    if (days < 7) return `${days}d atras`;
    return date.toLocaleDateString('pt-BR');
  }

  formatRequestDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h atras`;
    if (days < 7) return `${days}d atras`;
    return date.toLocaleDateString('pt-BR');
  }

  getActionButtonText(userId: string): string {
    if (this.socialFacade.isFriend(userId)) return 'Amigo';

    const pendingStatus = this.socialFacade.pendingRequestStatus(userId);
    if (pendingStatus === 'sent') return 'Requisicao Enviada';
    if (pendingStatus === 'received') return 'Aceitar';

    return 'Adicionar';
  }
}

import { computed, Injectable, inject } from '@angular/core';
import { FriendRelationship, FriendsService } from './friends.service';
import { User, UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SocialFacadeService {
  private readonly userService = inject(UserService);
  private readonly friendsService = inject(FriendsService);

  readonly currentUser = this.userService.currentUserSignal;
  readonly friendsList = this.friendsService.friendsList;
  readonly receivedRequests = this.friendsService.receivedRequests;
  readonly sentRequests = this.friendsService.sentRequests;
  readonly favoriteFriends = this.friendsService.favoriteFriends;
  readonly totalFriends = this.friendsService.totalFriends;
  readonly pendingCount = this.friendsService.pendingRequestsCount;
  readonly allUsers = computed(() => this.userService.getAllUsers());

  suggestedUsers(query: string): User[] {
    const normalizedQuery = query.trim().toLowerCase();
    const friendIds = this.friendsList().map((friend) => friend.friendId);
    const sentRequestIds = this.sentRequests().map((request) => request.receiverId);
    const excludedIds = new Set([...friendIds, ...sentRequestIds, this.currentUser().id]);

    return this.allUsers().filter((user) => {
      if (excludedIds.has(user.id)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.bio?.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  getUserById(userId: string): User | undefined {
    return this.userService.getUserById(userId);
  }

  sendFriendRequest(userId: string, userName: string, userAvatar: string): void {
    this.friendsService.sendFriendRequest(userId, userName, userAvatar);
  }

  acceptFriendRequest(requestId: string, senderId: string, senderName: string, senderAvatar: string): void {
    this.friendsService.acceptFriendRequest(requestId, senderId, senderName, senderAvatar);
  }

  acceptPendingRequestForUser(user: User): void {
    const request = this.friendsService.getAllRequests().find((entry) => entry.senderId === user.id);

    if (request) {
      this.acceptFriendRequest(request.id, user.id, user.name, user.avatar);
    }
  }

  declineFriendRequest(requestId: string): void {
    this.friendsService.declineFriendRequest(requestId);
  }

  cancelSentRequest(requestId: string): void {
    this.friendsService.cancelSentRequest(requestId);
  }

  removeFriend(friendId: string): void {
    this.friendsService.removeFriend(friendId);
  }

  toggleFavorite(friendId: string): void {
    this.friendsService.toggleFavorite(friendId);
  }

  isFriend(userId: string): boolean {
    return this.friendsService.isFriend(userId);
  }

  pendingRequestStatus(userId: string): 'sent' | 'received' | null {
    return this.friendsService.hasPendingRequest(userId);
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUser().id === userId;
  }

  getFriendById(userId: string): FriendRelationship | undefined {
    return this.friendsList().find((friend) => friend.friendId === userId);
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { createMockFriendRequests, createMockFriendsList } from '@core/mocks/friends.mock';

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  requestDate: Date;
  respondedDate?: Date;
}

export interface FriendRelationship {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  friendLevel: number;
  friendLastOnline: Date;
  friendedDate: Date;
  isFavorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class FriendsService {
  private friendsListSignal = signal<FriendRelationship[]>(createMockFriendsList());
  private friendRequestsSignal = signal<FriendRequest[]>(createMockFriendRequests());

  friendsList = computed(() => this.friendsListSignal());
  receivedRequests = computed(() =>
    this.friendRequestsSignal().filter((req) => req.receiverId === 'user-current' && req.status === 'pending'),
  );
  sentRequests = computed(() =>
    this.friendRequestsSignal().filter((req) => req.senderId === 'user-current' && req.status === 'pending'),
  );
  pendingRequestsCount = computed(() => this.receivedRequests().length);
  totalFriends = computed(() => this.friendsList().length);
  favoriteFriends = computed(() => this.friendsList().filter((friend) => friend.isFavorite));

  getAllRequests(): FriendRequest[] {
    return this.friendRequestsSignal();
  }

  sendFriendRequest(userId: string, _userName: string, _userAvatar: string): void {
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      senderId: 'user-current',
      senderName: 'Voce',
      senderAvatar: '👤',
      receiverId: userId,
      status: 'pending',
      requestDate: new Date(),
    };

    this.friendRequestsSignal.update((requests) => [...requests, newRequest]);
  }

  acceptFriendRequest(requestId: string, senderId: string, senderName: string, senderAvatar: string): void {
    this.friendRequestsSignal.update((requests) =>
      requests.map((req) => (req.id === requestId ? { ...req, status: 'accepted', respondedDate: new Date() } : req)),
    );

    const newFriend: FriendRelationship = {
      id: `friend-${Date.now()}`,
      userId: 'user-current',
      friendId: senderId,
      friendName: senderName,
      friendAvatar: senderAvatar,
      friendLevel: 0,
      friendLastOnline: new Date(),
      friendedDate: new Date(),
      isFavorite: false,
    };

    this.friendsListSignal.update((friends) => [...friends, newFriend]);
  }

  declineFriendRequest(requestId: string): void {
    this.friendRequestsSignal.update((requests) =>
      requests.map((req) => (req.id === requestId ? { ...req, status: 'declined', respondedDate: new Date() } : req)),
    );
  }

  removeFriend(friendId: string): void {
    this.friendsListSignal.update((friends) => friends.filter((friend) => friend.friendId !== friendId));
  }

  toggleFavorite(friendId: string): void {
    this.friendsListSignal.update((friends) =>
      friends.map((friend) =>
        friend.friendId === friendId ? { ...friend, isFavorite: !friend.isFavorite } : friend,
      ),
    );
  }

  cancelSentRequest(requestId: string): void {
    this.friendRequestsSignal.update((requests) => requests.filter((request) => request.id !== requestId));
  }

  isFriend(userId: string): boolean {
    return this.friendsList().some((friend) => friend.friendId === userId);
  }

  hasPendingRequest(userId: string): 'sent' | 'received' | null {
    const sent = this.sentRequests().some((request) => request.receiverId === userId);
    const received = this.receivedRequests().some((request) => request.senderId === userId);

    if (sent) return 'sent';
    if (received) return 'received';
    return null;
  }
}

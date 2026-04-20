import { Injectable, signal, computed } from '@angular/core';

/**
 * FriendRequest interface
 */
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

/**
 * FriendRelationship interface
 */
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

/**
 * FriendsService: Gerencia relações de amizade
 */
@Injectable({ providedIn: 'root' })
export class FriendsService {
  /**
   * Lista de amigos do usuário atual
   */
  private friendsListSignal = signal<FriendRelationship[]>([
    {
      id: 'friend-1',
      userId: 'user-current',
      friendId: 'user-001',
      friendName: 'Jogador Lendário',
      friendAvatar: '👑',
      friendLevel: 50,
      friendLastOnline: new Date(Date.now() - 30 * 60 * 1000),
      friendedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      isFavorite: true,
    },
    {
      id: 'friend-2',
      userId: 'user-current',
      friendId: 'user-004',
      friendName: 'Speed Runner',
      friendAvatar: '⚡',
      friendLevel: 42,
      friendLastOnline: new Date(Date.now() - 2 * 60 * 60 * 1000),
      friendedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      isFavorite: true,
    },
    {
      id: 'friend-3',
      userId: 'user-current',
      friendId: 'user-008',
      friendName: 'Consistência Pro',
      friendAvatar: '🔥',
      friendLevel: 38,
      friendLastOnline: new Date(Date.now() - 8 * 60 * 60 * 1000),
      friendedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isFavorite: false,
    },
  ]);

  /**
   * Requisições de amizade (recebidas e enviadas)
   */
  private friendRequestsSignal = signal<FriendRequest[]>([
    {
      id: 'req-1',
      senderId: 'user-002',
      senderName: 'Streaker Infinito',
      senderAvatar: '⭐',
      receiverId: 'user-current',
      status: 'pending',
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'req-2',
      senderId: 'user-current',
      senderName: 'Você',
      senderAvatar: '👤',
      receiverId: 'user-005',
      status: 'pending',
      requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 'req-3',
      senderId: 'user-003',
      senderName: 'Colecionador Elite',
      senderAvatar: '🏆',
      receiverId: 'user-current',
      status: 'pending',
      requestDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ]);

  /**
   * Lista de amigos do usuário atual
   */
  friendsList = computed(() => this.friendsListSignal());

  /**
   * Requisições pendentes recebidas
   */
  receivedRequests = computed(() => {
    return this.friendRequestsSignal().filter(
      (req) => req.receiverId === 'user-current' && req.status === 'pending',
    );
  });

  /**
   * Requisições pendentes enviadas
   */
  sentRequests = computed(() => {
    return this.friendRequestsSignal().filter(
      (req) => req.senderId === 'user-current' && req.status === 'pending',
    );
  });

  /**
   * Total de requisições pendentes
   */
  pendingRequestsCount = computed(() => {
    return this.receivedRequests().length;
  });

  /**
   * Total de amigos
   */
  totalFriends = computed(() => {
    return this.friendsList().length;
  });

  /**
   * Amigos favoritos
   */
  favoriteFriends = computed(() => {
    return this.friendsList().filter((f) => f.isFavorite);
  });

  /**
   * Obter todas as requisições de amizade
   */
  getAllRequests(): FriendRequest[] {
    return this.friendRequestsSignal();
  }

  /**
   * Enviar requisição de amizade
   */
  sendFriendRequest(userId: string, userName: string, userAvatar: string): void {
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      senderId: 'user-current',
      senderName: 'Você',
      senderAvatar: '👤',
      receiverId: userId,
      status: 'pending',
      requestDate: new Date(),
    };

    this.friendRequestsSignal.update((requests) => [...requests, newRequest]);
  }

  /**
   * Aceitar requisição de amizade
   */
  acceptFriendRequest(requestId: string, senderId: string, senderName: string, senderAvatar: string): void {
    // Atualizar status da requisição
    this.friendRequestsSignal.update((requests) => {
      return requests.map((req) => {
        if (req.id === requestId) {
          return { ...req, status: 'accepted', respondedDate: new Date() };
        }
        return req;
      });
    });

    // Adicionar à lista de amigos
    const newFriend: FriendRelationship = {
      id: `friend-${Date.now()}`,
      userId: 'user-current',
      friendId: senderId,
      friendName: senderName,
      friendAvatar: senderAvatar,
      friendLevel: 0, // Seria preenchido do UserService
      friendLastOnline: new Date(),
      friendedDate: new Date(),
      isFavorite: false,
    };

    this.friendsListSignal.update((friends) => [...friends, newFriend]);
  }

  /**
   * Recusar requisição de amizade
   */
  declineFriendRequest(requestId: string): void {
    this.friendRequestsSignal.update((requests) => {
      return requests.map((req) => {
        if (req.id === requestId) {
          return { ...req, status: 'declined', respondedDate: new Date() };
        }
        return req;
      });
    });
  }

  /**
   * Remover amigo
   */
  removeFriend(friendId: string): void {
    this.friendsListSignal.update((friends) => {
      return friends.filter((f) => f.friendId !== friendId);
    });
  }

  /**
   * Marcar/desmarcar como favorito
   */
  toggleFavorite(friendId: string): void {
    this.friendsListSignal.update((friends) => {
      return friends.map((f) => {
        if (f.friendId === friendId) {
          return { ...f, isFavorite: !f.isFavorite };
        }
        return f;
      });
    });
  }

  /**
   * Cancelar requisição enviada
   */
  cancelSentRequest(requestId: string): void {
    this.friendRequestsSignal.update((requests) => {
      return requests.filter((r) => r.id !== requestId);
    });
  }

  /**
   * Verificar se é amigo
   */
  isFriend(userId: string): boolean {
    return this.friendsList().some((f) => f.friendId === userId);
  }

  /**
   * Verificar se tem requisição pendente
   */
  hasPendingRequest(userId: string): 'sent' | 'received' | null {
    const sent = this.sentRequests().some((r) => r.receiverId === userId);
    const received = this.receivedRequests().some((r) => r.senderId === userId);

    if (sent) return 'sent';
    if (received) return 'received';
    return null;
  }
}

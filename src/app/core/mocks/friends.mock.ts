import type { FriendRelationship, FriendRequest } from '@core/services/friends.service';

export function createMockFriendsList(): FriendRelationship[] {
  return [
    {
      id: 'friend-1',
      userId: 'user-current',
      friendId: 'user-001',
      friendName: 'Jogador Lendario',
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
      friendName: 'Consistencia Pro',
      friendAvatar: '🔥',
      friendLevel: 38,
      friendLastOnline: new Date(Date.now() - 8 * 60 * 60 * 1000),
      friendedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isFavorite: false,
    },
  ];
}

export function createMockFriendRequests(): FriendRequest[] {
  return [
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
      senderName: 'Voce',
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
  ];
}

import type { InventoryItem, PurchaseTransaction, ShopItem } from '@core/services/shop.service';

export function createMockShopCatalog(): ShopItem[] {
  return [
    {
      id: 'item-1',
      name: 'Gato Ninja',
      description: 'Um gato ninja como mascote',
      icon: '🐱',
      category: 'cosmetic',
      price: 150,
      rarity: 'rare',
      isNew: true,
    },
    {
      id: 'item-2',
      name: 'Dragao Roxo',
      description: 'Um dragao mistico roxo',
      icon: '🐉',
      category: 'cosmetic',
      price: 250,
      rarity: 'epic',
      isNew: false,
    },
    {
      id: 'item-3',
      name: 'Unicornio Brilhoso',
      description: 'Um unicornio com brilho especial',
      icon: '🦄',
      category: 'cosmetic',
      price: 200,
      rarity: 'epic',
      isNew: true,
    },
    {
      id: 'item-4',
      name: 'Dobro de XP (7 dias)',
      description: 'Ganhe o dobro de XP pelas proximas 7 dias',
      icon: '⚡',
      category: 'boost',
      price: 500,
      rarity: 'rare',
      isNew: false,
    },
    {
      id: 'item-5',
      name: 'Protetor de Streak',
      description: 'Proteja seu streak por 1 falha',
      icon: '🛡️',
      category: 'boost',
      price: 300,
      rarity: 'epic',
      isNew: false,
    },
    {
      id: 'item-6',
      name: 'Tema Neon',
      description: 'Tema com cores neon brilhantes',
      icon: '💎',
      category: 'theme',
      price: 200,
      rarity: 'rare',
      isNew: true,
    },
    {
      id: 'item-7',
      name: 'Tema Floresta',
      description: 'Tema com cores verdes naturais',
      icon: '🌿',
      category: 'theme',
      price: 150,
      rarity: 'common',
      isNew: false,
    },
    {
      id: 'item-8',
      name: 'Placa: Speedrunner',
      description: 'Mostra que voce e rapido',
      icon: '🏃',
      category: 'badge',
      price: 100,
      rarity: 'common',
      isNew: false,
    },
    {
      id: 'item-9',
      name: 'Placa: Lenda',
      description: 'A placa do verdadeiro lendario',
      icon: '👑',
      category: 'badge',
      price: 1000,
      rarity: 'legendary',
      isNew: false,
    },
  ];
}

export function createMockInventory(): InventoryItem[] {
  return [
    {
      id: 'item-1',
      name: 'Gato Ninja',
      description: 'Um gato ninja como mascote',
      icon: '🐱',
      category: 'cosmetic',
      price: 150,
      rarity: 'rare',
      isNew: true,
      quantity: 1,
      purchasedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
}

export function createMockPurchaseHistory(): PurchaseTransaction[] {
  return [
    {
      id: 'trans-1',
      itemId: 'item-1',
      itemName: 'Gato Ninja',
      price: 150,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
}

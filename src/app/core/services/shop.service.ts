import { Injectable, signal, computed } from '@angular/core';

/**
 * ShopItem interface
 */
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'cosmetic' | 'boost' | 'theme' | 'badge';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount?: number;
  isNew: boolean;
}

/**
 * InventoryItem: Item possuído pelo usuário
 */
export interface InventoryItem extends ShopItem {
  purchasedDate: Date;
  quantity: number;
}

/**
 * PurchaseTransaction
 */
export interface PurchaseTransaction {
  id: string;
  itemId: string;
  itemName: string;
  price: number;
  date: Date;
}

/**
 * ShopService: Gerencia loja itens e inventário
 */
@Injectable({ providedIn: 'root' })
export class ShopService {
  /**
   * Catálogo de itens disponíveis na loja
   */
  catalogSignal = signal<ShopItem[]>([
    // Cosmetics
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
      name: 'Dragão Roxo',
      description: 'Um dragão místico roxo',
      icon: '🐉',
      category: 'cosmetic',
      price: 250,
      rarity: 'epic',
      isNew: false,
    },
    {
      id: 'item-3',
      name: 'Unicórnio Brilhoso',
      description: 'Um unicórnio com brilho especial',
      icon: '🦄',
      category: 'cosmetic',
      price: 200,
      rarity: 'epic',
      isNew: true,
    },
    // Boosts
    {
      id: 'item-4',
      name: 'Dobro de XP (7 dias)',
      description: 'Ganhe o dobro de XP pelas próximas 7 dias',
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
    // Themes
    {
      id: 'item-6',
      name: 'Tema Neon',
      description: 'Tema com cores neon brilhantes',
      icon: '💜',
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
    // Badges
    {
      id: 'item-8',
      name: 'Placa: Speedrunner',
      description: 'Mostra que você é rápido!',
      icon: '🏃',
      category: 'badge',
      price: 100,
      rarity: 'common',
      isNew: false,
    },
    {
      id: 'item-9',
      name: 'Placa: Lenda',
      description: 'A placa do verdadeiro lendário',
      icon: '👑',
      category: 'badge',
      price: 1000,
      rarity: 'legendary',
      isNew: false,
    },
  ]);

  /**
   * Inventário do usuário
   */
  inventorySignal = signal<InventoryItem[]>([
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
      purchasedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    },
  ]);

  /**
   * Histórico de compras
   */
  purchaseHistorySignal = signal<PurchaseTransaction[]>([
    {
      id: 'trans-1',
      itemId: 'item-1',
      itemName: 'Gato Ninja',
      price: 150,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  // ───────────────────────────────────────────────────────────────
  // 📊 COMPUTED
  // ───────────────────────────────────────────────────────────────

  /**
   * Total de moedas gastas
   */
  totalSpent = computed(() => {
    return this.purchaseHistorySignal().reduce((sum, trans) => sum + trans.price, 0);
  });

  /**
   * Total de itens no inventário
   */
  totalItems = computed(() => {
    return this.inventorySignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  /**
   * Última compra
   */
  lastPurchase = computed(() => {
    const history = this.purchaseHistorySignal();
    if (history.length === 0) return null;
    return history[history.length - 1];
  });

  // ───────────────────────────────────────────────────────────────
  // 🛍️ SHOP METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Obter catálogo completo
   */
  getCatalog(): ShopItem[] {
    return this.catalogSignal();
  }

  /**
   * Filtrar itens por categoria
   */
  getItemsByCategory(category: ShopItem['category']): ShopItem[] {
    return this.catalogSignal().filter((item) => item.category === category);
  }

  /**
   * Filtrar itens por raridade
   */
  getItemsByRarity(rarity: ShopItem['rarity']): ShopItem[] {
    return this.catalogSignal().filter((item) => item.rarity === rarity);
  }

  /**
   * Obter preço final com desconto
   */
  getFinalPrice(item: ShopItem): number {
    if (!item.discount) return item.price;
    return Math.floor(item.price * (1 - item.discount / 100));
  }

  /**
   * Procurar item por ID
   */
  getItemById(id: string): ShopItem | undefined {
    return this.catalogSignal().find((item) => item.id === id);
  }

  /**
   * Itens em destaque (com desconto ou novos)
   */
  getFeaturedItems(): ShopItem[] {
    return this.catalogSignal().filter((item) => item.isNew || item.discount);
  }

  // ───────────────────────────────────────────────────────────────
  // 🎁 INVENTORY METHODS
  // ───────────────────────────────────────────────────────────────

  /**
   * Obter inventário completo
   */
  getInventory(): InventoryItem[] {
    return this.inventorySignal();
  }

  /**
   * Verificar se item está no inventário
   */
  hasItem(itemId: string): boolean {
    return this.inventorySignal().some((item) => item.id === itemId);
  }

  /**
   * Contar quantidade de um item
   */
  getItemQuantity(itemId: string): number {
    const item = this.inventorySignal().find((i) => i.id === itemId);
    return item?.quantity ?? 0;
  }

  /**
   * Comprar item (deve ser integrado com GamificationService para moedas)
   */
  purchaseItem(item: ShopItem): { success: boolean; message: string } {
    // Verificação de duplicação
    const inventoryItem = this.inventorySignal().find((i) => i.id === item.id);
    const finalPrice = this.getFinalPrice(item);

    if (inventoryItem) {
      // Item já está no inventário
      return { success: false, message: 'Você já possui este item!' };
    }

    // Adicionar ao inventário
    this.inventorySignal.update((inventory) => [
      ...inventory,
      {
        ...item,
        quantity: 1,
        purchasedDate: new Date(),
      },
    ]);

    // Adicionar ao histórico
    this.purchaseHistorySignal.update((history) => [
      ...history,
      {
        id: `trans-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        price: finalPrice,
        date: new Date(),
      },
    ]);

    console.log(`✅ Item comprado: ${item.name}`);
    return { success: true, message: `${item.name} adicionado ao inventário!` };
  }

  /**
   * Usar/Remover item do inventário
   */
  useItem(itemId: string): void {
    this.inventorySignal.update((inventory) => inventory.filter((i) => i.id !== itemId));
  }

  /**
   * Obter histórico de compras
   */
  getPurchaseHistory(): PurchaseTransaction[] {
    return this.purchaseHistorySignal();
  }

  /**
   * Reset da loja (desenvolvimento)
   */
  resetShop(): void {
    this.inventorySignal.set([]);
    this.purchaseHistorySignal.set([]);
  }
}

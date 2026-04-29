import { Injectable, signal, computed } from '@angular/core';
import { createMockInventory, createMockPurchaseHistory, createMockShopCatalog } from '@core/mocks/shop.mock';

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

export interface InventoryItem extends ShopItem {
  purchasedDate: Date;
  quantity: number;
}

export interface PurchaseTransaction {
  id: string;
  itemId: string;
  itemName: string;
  price: number;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  catalogSignal = signal<ShopItem[]>(createMockShopCatalog());
  inventorySignal = signal<InventoryItem[]>(createMockInventory());
  purchaseHistorySignal = signal<PurchaseTransaction[]>(createMockPurchaseHistory());

  totalSpent = computed(() => this.purchaseHistorySignal().reduce((sum, trans) => sum + trans.price, 0));
  totalItems = computed(() => this.inventorySignal().reduce((sum, item) => sum + item.quantity, 0));
  lastPurchase = computed(() => {
    const history = this.purchaseHistorySignal();
    return history.length === 0 ? null : history[history.length - 1];
  });

  getCatalog(): ShopItem[] {
    return this.catalogSignal();
  }

  getItemsByCategory(category: ShopItem['category']): ShopItem[] {
    return this.catalogSignal().filter((item) => item.category === category);
  }

  getItemsByRarity(rarity: ShopItem['rarity']): ShopItem[] {
    return this.catalogSignal().filter((item) => item.rarity === rarity);
  }

  getFinalPrice(item: ShopItem): number {
    if (!item.discount) return item.price;
    return Math.floor(item.price * (1 - item.discount / 100));
  }

  getItemById(id: string): ShopItem | undefined {
    return this.catalogSignal().find((item) => item.id === id);
  }

  getFeaturedItems(): ShopItem[] {
    return this.catalogSignal().filter((item) => item.isNew || item.discount);
  }

  getInventory(): InventoryItem[] {
    return this.inventorySignal();
  }

  hasItem(itemId: string): boolean {
    return this.inventorySignal().some((item) => item.id === itemId);
  }

  getItemQuantity(itemId: string): number {
    const item = this.inventorySignal().find((inventoryItem) => inventoryItem.id === itemId);
    return item?.quantity ?? 0;
  }

  purchaseItem(item: ShopItem): { success: boolean; message: string } {
    const inventoryItem = this.inventorySignal().find((inventoryEntry) => inventoryEntry.id === item.id);
    const finalPrice = this.getFinalPrice(item);

    if (inventoryItem) {
      return { success: false, message: 'Voce ja possui este item.' };
    }

    this.inventorySignal.update((inventory) => [
      ...inventory,
      {
        ...item,
        quantity: 1,
        purchasedDate: new Date(),
      },
    ]);

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

    return { success: true, message: `${item.name} adicionado ao inventario.` };
  }

  useItem(itemId: string): void {
    this.inventorySignal.update((inventory) => inventory.filter((item) => item.id !== itemId));
  }

  getPurchaseHistory(): PurchaseTransaction[] {
    return this.purchaseHistorySignal();
  }

  resetShop(): void {
    this.inventorySignal.set([]);
    this.purchaseHistorySignal.set([]);
  }
}

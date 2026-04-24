import { computed, Injectable, inject } from '@angular/core';
import { GamificationService } from './gamification.service';
import { ShopItem, ShopService } from './shop.service';

@Injectable({ providedIn: 'root' })
export class ShopFacadeService {
  private readonly shopService = inject(ShopService);
  private readonly gamificationService = inject(GamificationService);

  readonly player = this.gamificationService.playerSignal;
  readonly totalItems = this.shopService.totalItems;
  readonly totalSpent = this.shopService.totalSpent;
  readonly catalog = this.shopService.catalogSignal;
  readonly inventory = this.shopService.inventorySignal;
  readonly featuredItems = computed(() => this.shopService.getFeaturedItems());

  getFilteredItems(category: ShopItem['category'] | 'all'): ShopItem[] {
    return category === 'all' ? this.catalog() : this.shopService.getItemsByCategory(category);
  }

  hasItem(itemId: string): boolean {
    return this.shopService.hasItem(itemId);
  }

  getFinalPrice(item: ShopItem): number {
    return this.shopService.getFinalPrice(item);
  }

  purchaseItem(item: ShopItem): { success: boolean; message: string } {
    const finalPrice = this.getFinalPrice(item);

    if (!this.gamificationService.canAfford(finalPrice)) {
      return { success: false, message: 'Moedas insuficientes.' };
    }

    const result = this.shopService.purchaseItem(item);

    if (result.success) {
      this.gamificationService.spendCoins(finalPrice, `Compra: ${item.name}`);
    }

    return result;
  }
}

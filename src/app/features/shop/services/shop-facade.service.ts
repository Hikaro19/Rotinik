import { computed, Injectable, inject, signal } from '@angular/core';
import { ShopItem, ShopService } from './shop.service';
import { GamificationService } from '../../medals/services/gamification.service';
import { firstValueFrom } from 'rxjs';
import { ThemeService } from '@core/services/theme.service';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';

@Injectable({ providedIn: 'root' })
export class ShopFacadeService {
  private readonly shopService = inject(ShopService);
  private readonly gamificationService = inject(GamificationService);
  private readonly themeService = inject(ThemeService);
  private readonly authFacade = inject(AuthFacadeService);

  // Estado Oficial da Loja
  readonly catalogSignal = signal<ShopItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorSignal = signal<string | null>(null);

  readonly featuredItems = computed(() => 
    this.catalogSignal().filter(item => item.isNew || item.discount)
  );

  readonly ownedItemsCount = computed(() => 
    this.catalogSignal().filter(item => item.isOwned).length
  );

  readonly totalItemsCount = computed(() => 
    this.catalogSignal().length
  );

  constructor() {
    this.loadCatalog();
  }

  /** Busca os itens no backend e alimenta os Signals */
  async loadCatalog(): Promise<void> {
    this.isLoading.set(true);
    this.errorSignal.set(null);
    try {
      const items = await firstValueFrom(this.shopService.getCatalog());
      this.catalogSignal.set(items);
    } catch (error) {
      console.error('Erro ao carregar a loja', error);
      this.errorSignal.set('Não foi possível carregar os itens da loja.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getFilteredItems(category: string): ShopItem[] {
    if (category === 'all') {
      return this.catalogSignal().filter(item => !(item.isNew || item.discount));
    }
    return this.catalogSignal().filter(item => item.category === category);
  }

  getFinalPrice(item: ShopItem): number {
    if (!item.discount) return item.price;
    return Math.floor(item.price * (1 - item.discount / 100));
  }

  /** Executa a compra real comunicando com o banco de dados */
  async purchaseItem(item: ShopItem): Promise<{ success: boolean; message: string }> {
    const finalPrice = this.getFinalPrice(item);

    // Validação otimista no front-end para evitar requisições inúteis
    if (!this.gamificationService.canAfford(finalPrice)) {
      return { success: false, message: 'Moedas insuficientes.' };
    }

    try {
      this.isLoading.set(true);
      
      // Chama a API. Se o C# estourar erro de saldo, ele cai no catch
      const response = await firstValueFrom(this.shopService.purchaseItem(item.id));
      
      // Atualiza as moedas visualmente na tela do usuário
      this.gamificationService.spendCoins(finalPrice, `Compra: ${item.name}`);
      
      // Atualiza o estado local para IsOwned
      this.catalogSignal.update(items => items.map(i => i.id === item.id ? { ...i, isOwned: true } : i));
      
      return { success: true, message: response.message };
    } catch (error: any) {
      // O backend retornou 400 Bad Request (ex: saldo insuficiente detectado no servidor)
      const errorMsg = error.error?.message || 'Erro ao processar a compra.';
      return { success: false, message: errorMsg };
    } finally {
      this.isLoading.set(false);
    }
  }

  async equipItem(item: ShopItem): Promise<{ success: boolean; message: string }> {
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.shopService.equipItem(item.id));
      
      let isNowEquipped = false;
      this.catalogSignal.update(items => items.map(i => {
        if (i.category === item.category) {
           if (i.id === item.id) {
             isNowEquipped = !i.isEquipped;
             return { ...i, isEquipped: isNowEquipped };
           }
           return { ...i, isEquipped: false };
        }
        return i;
      }));

      // Atualiza visualmente o tema e o authFacade
      this.themeService.applyCosmetic(item.category, isNowEquipped ? item.icon : null);
      const sessionObj = this.authFacade.session();
      if (sessionObj?.user) {
        if (!sessionObj.user.equippedCosmetics) {
          sessionObj.user.equippedCosmetics = {};
        }
        if (isNowEquipped) {
          sessionObj.user.equippedCosmetics[item.category] = item.icon;
        } else {
          delete sessionObj.user.equippedCosmetics[item.category];
        }
        // Força atualização reativa
        (this.authFacade as any).sessionSignal.set({ ...sessionObj });
      }
      
      return { success: true, message: response.message };
    } catch (error: any) {
      const errorMsg = error.error?.message || 'Erro ao equipar item.';
      return { success: false, message: errorMsg };
    } finally {
      this.isLoading.set(false);
    }
  }
}
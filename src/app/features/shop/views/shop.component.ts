import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopFacadeService } from '../services/shop-facade.service';
import { ShopItem } from '../services/shop.service';
import { GamificationService } from '../../medals/services/gamification.service';
import { AppCardComponent } from '@shared/components/ui/card/card.component';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';
import { AppSpinnerComponent } from '@shared/components/ui/spinner/spinner.component';
import { AppToastComponent } from '@shared/components/ui/toast/toast.component';
import { AppShopItemComponent } from '@shared/components/feature/shop-item/shop-item.component';

type ShopCategory = 'all' | 'cosmetic' | 'boost' | 'theme' | 'badge';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    AppSpinnerComponent,
    AppToastComponent,
    AppShopItemComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  shopFacade = inject(ShopFacadeService);
  gamificationService = inject(GamificationService);

  currentCategorySignal = signal<ShopCategory>('all');
  currentCategory = () => this.currentCategorySignal();

  // Expondo o jogador para o HTML ler as moedas
  player = this.gamificationService.playerSignal;

  ngOnInit(): void { }

  getFilteredItems(): ShopItem[] {
    return this.shopFacade.getFilteredItems(this.currentCategorySignal());
  }

  getCategoryTitle(): string {
    const titles: Record<ShopCategory, string> = {
      all: 'Todos os Itens',
      cosmetic: 'Cosméticos',
      boost: 'Impulsos',
      theme: 'Temas',
      badge: 'Placas',
    };
    return titles[this.currentCategorySignal()];
  }

  setCategory(category: ShopCategory): void {
    this.currentCategorySignal.set(category);
  }

  async onPurchaseItem(item: ShopItem): Promise<void> {
    const result = await this.shopFacade.purchaseItem(item);

    // Temporário até plugar o Toast real na tela
    if (result.success) {
      alert(`Sucesso: ${result.message}`);
    } else {
      alert(`Aviso: ${result.message}`);
    }
  }
}
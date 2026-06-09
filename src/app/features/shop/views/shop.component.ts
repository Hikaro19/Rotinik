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
import { ConfirmDialogComponent } from '@shared/components/ui/confirm-dialog/confirm-dialog.component';

type ShopCategory = 'all' | 'avatar' | 'border' | 'level_icon' | 'background' | 'navbar';

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
    ConfirmDialogComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  shopFacade = inject(ShopFacadeService);
  gamificationService = inject(GamificationService);

  currentCategorySignal = signal<ShopCategory>('all');
  currentCategory = () => this.currentCategorySignal();

  dialogConfig = signal<{ isOpen: boolean; title: string; message: string; isDestructive: boolean } | null>(null);

  // Expondo o jogador para o HTML ler as moedas
  player = this.gamificationService.playerSignal;

  ngOnInit(): void {
    this.shopFacade.loadCatalog();
  }

  getFilteredItems(): ShopItem[] {
    return this.shopFacade.getFilteredItems(this.currentCategorySignal());
  }

  getCategoryTitle(): string {
    const titles: Record<ShopCategory, string> = {
      all: 'Todos os Itens',
      avatar: 'Fotos de Perfil',
      border: 'Bordas',
      level_icon: 'Ícones de Nível',
      background: 'Fundos de Modais',
      navbar: 'Estilos da NavBar',
    };
    return titles[this.currentCategorySignal()];
  }

  setCategory(category: ShopCategory): void {
    this.currentCategorySignal.set(category);
  }

  async onPurchaseItem(item: ShopItem): Promise<void> {
    const result = await this.shopFacade.purchaseItem(item);

    if (result.success) {
      this.openDialog('Compra Realizada', result.message, false);
    } else {
      this.openDialog('Aviso', result.message, true);
    }
  }

  async onEquipItem(item: ShopItem): Promise<void> {
    const result = await this.shopFacade.equipItem(item);
    if (!result.success) {
      this.openDialog('Aviso', result.message, true);
    }
  }

  openDialog(title: string, message: string, isDestructive: boolean): void {
    this.dialogConfig.set({
      isOpen: true,
      title,
      message,
      isDestructive
    });
  }

  closeDialog(): void {
    this.dialogConfig.set(null);
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopFacadeService } from '@core/services/shop-facade.service';
import { ShopItem } from '@core/services/shop.service';
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
  template: `
    <div class="shop-container">
      <div class="shop-header">
        <div class="shop-header-content">
          <h1 class="shop-title">Loja de Itens 🛍️</h1>
          <p class="shop-subtitle">Gaste suas moedas em itens especiais e melhorias</p>
        </div>

        <app-card variant="outlined" padding="md" rounded="md" class="player-info">
          <div class="player-info-content">
            <div class="player-stat">
              <span class="stat-label">Moedas</span>
              <span class="stat-value">{{ shopFacade.player().coins }}</span>
            </div>
            <div class="player-stat">
              <span class="stat-label">Itens</span>
              <span class="stat-value">{{ shopFacade.totalItems() }}</span>
            </div>
            <div class="player-stat">
              <span class="stat-label">Gastos</span>
              <span class="stat-value">{{ shopFacade.totalSpent() }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="shop-filter">
        <button
          type="button"
          class="filter-btn"
          [class.filter-btn--active]="currentCategory() === 'all'"
          (click)="setCategory('all')"
        >
          Todos
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.filter-btn--active]="currentCategory() === 'cosmetic'"
          (click)="setCategory('cosmetic')"
        >
          Cosmeticos
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.filter-btn--active]="currentCategory() === 'boost'"
          (click)="setCategory('boost')"
        >
          Impulsos
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.filter-btn--active]="currentCategory() === 'theme'"
          (click)="setCategory('theme')"
        >
          Temas
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.filter-btn--active]="currentCategory() === 'badge'"
          (click)="setCategory('badge')"
        >
          Placas
        </button>
      </div>

      <div *ngIf="currentCategory() === 'all'" class="shop-featured">
        <h2 class="shop-section-title">⭐ Em Destaque</h2>
        <div class="shop-grid">
          <app-shop-item
            *ngFor="let item of shopFacade.featuredItems()"
            [item]="item"
            [purchased]="shopFacade.hasItem(item.id)"
            (purchase)="onPurchaseItem($event)"
          ></app-shop-item>
        </div>
      </div>

      <h2 class="shop-section-title" *ngIf="currentCategory() !== 'all'">
        {{ getCategoryTitle() }}
      </h2>
      <div *ngIf="getFilteredItems().length > 0" class="shop-grid">
        <app-shop-item
          *ngFor="let item of getFilteredItems()"
          [item]="item"
          [purchased]="shopFacade.hasItem(item.id)"
          (purchase)="onPurchaseItem($event)"
        ></app-shop-item>
      </div>

      <div *ngIf="getFilteredItems().length === 0 && currentCategory() !== 'all'" class="shop-empty">
        <app-card variant="outlined" padding="lg" rounded="md">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h2>Nenhum item encontrado</h2>
            <p>Tente mudar a categoria para encontrar mais itens</p>
          </div>
        </app-card>
      </div>

      <div class="shop-inventory">
        <h2 class="shop-section-title">📦 Seu Inventario</h2>
        <div *ngIf="shopFacade.inventory().length > 0">
          <app-card variant="outlined" padding="md" rounded="md">
            <div class="inventory-grid">
              <div *ngFor="let item of shopFacade.inventory()" class="inventory-item">
                <span class="inventory-item__icon">{{ item.icon }}</span>
                <span class="inventory-item__name">{{ item.name }}</span>
                <span class="inventory-item__qty">x{{ item.quantity }}</span>
              </div>
            </div>
          </app-card>
        </div>
        <div *ngIf="shopFacade.inventory().length === 0">
          <app-card variant="outlined" padding="lg" rounded="md">
            <p class="text-center shop-empty-copy">Seu inventario esta vazio. Compre alguns itens para comecar!</p>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .shop-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .shop-header {
        margin-bottom: 32px;
      }

      .shop-header-content {
        margin-bottom: 16px;
      }

      .shop-title {
        margin: 0 0 8px 0;
        font-size: 32px;
        font-weight: 700;
      }

      .shop-subtitle {
        margin: 0;
        font-size: 16px;
        color: var(--text-secondary);
      }

      .player-info {
        width: 100%;
      }

      .player-info-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 16px;
      }

      .player-stat {
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 12px;
        color: var(--text-secondary);
        font-weight: 500;
        margin-bottom: 4px;
      }

      .stat-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: var(--brand-neon);
      }

      .shop-filter {
        display: flex;
        gap: 8px;
        margin-bottom: 32px;
        flex-wrap: wrap;
      }

      .filter-btn {
        background: var(--surface-secondary);
        border: 2px solid transparent;
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition:
          border-color 0.2s ease,
          color 0.2s ease,
          background-color 0.2s ease;
      }

      .filter-btn:hover {
        border-color: var(--brand-neon);
        color: var(--brand-neon);
      }

      .filter-btn--active {
        background: var(--brand-neon);
        color: white;
        border-color: var(--brand-neon);
      }

      .shop-section-title {
        margin: 0 0 16px 0;
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .shop-featured {
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--surface-tertiary);
      }

      .shop-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }

      .shop-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      .empty-state {
        text-align: center;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .shop-inventory {
        margin-top: 40px;
        padding-top: 32px;
        border-top: 1px solid var(--surface-tertiary);
      }

      .inventory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
      }

      .inventory-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--surface-secondary);
        border-radius: 8px;
        text-align: center;
      }

      .inventory-item__icon {
        font-size: 32px;
      }

      .inventory-item__name {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .inventory-item__qty {
        font-size: 11px;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .text-center {
        text-align: center;
      }

      .shop-empty-copy {
        color: var(--text-secondary);
      }

      @media (max-width: 768px) {
        .shop-container {
          padding: 12px;
        }

        .shop-title {
          font-size: 24px;
        }

        .shop-grid {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .player-info-content {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `,
  ],
})
export class ShopComponent implements OnInit {
  shopFacade = inject(ShopFacadeService);

  currentCategorySignal = signal<ShopCategory>('all');
  currentCategory = () => this.currentCategorySignal();

  ngOnInit(): void {}

  getFilteredItems(): ShopItem[] {
    return this.shopFacade.getFilteredItems(this.currentCategorySignal());
  }

  getCategoryTitle(): string {
    const titles: Record<ShopCategory, string> = {
      all: 'Todos os Itens',
      cosmetic: 'Cosmeticos',
      boost: 'Impulsos',
      theme: 'Temas',
      badge: 'Placas',
    };
    return titles[this.currentCategorySignal()];
  }

  setCategory(category: ShopCategory): void {
    this.currentCategorySignal.set(category);
  }

  onPurchaseItem(item: ShopItem): void {
    this.shopFacade.purchaseItem(item);
  }
}

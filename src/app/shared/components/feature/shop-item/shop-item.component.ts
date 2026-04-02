import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopItem } from '@core/services/shop.service';
import { AppCardComponent } from '../../ui/card/card.component';
import { AppButtonComponent } from '../../ui/button/button.component';

/**
 * ShopItemComponent: Exibe um item da loja com preço e ações
 */
@Component({
  selector: 'app-shop-item',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppButtonComponent],
  template: `
    <app-card
      variant="default"
      padding="md"
      rounded="md"
      [clickable]="true"
      role="article"
      [attr.aria-label]="item.name"
    >
      <!-- Item Header -->
      <div class="shop-item__header">
        <div class="shop-item__icon">{{ item.icon }}</div>
        <div class="shop-item__badge" [class]="'shop-item__badge--' + item.rarity">
          {{ rarityLabel() }}
        </div>
        <div *ngIf="item.isNew" class="shop-item__new-badge">NOVO</div>
      </div>

      <!-- Item Info -->
      <div class="shop-item__content">
        <h3 class="shop-item__name">{{ item.name }}</h3>
        <p class="shop-item__description">{{ item.description }}</p>

        <!-- Category Badge -->
        <div class="shop-item__category">{{ categoryLabel() }}</div>

        <!-- Price Section -->
        <div class="shop-item__price">
          <div *ngIf="item.discount; else normalPrice" class="price-section--discount">
            <span class="shop-item__price-original">{{ item.price }}</span>
            <span class="shop-item__price-final">{{ finalPrice() }}</span>
            <span class="shop-item__discount">-{{ item.discount }}%</span>
          </div>
          <ng-template #normalPrice>
            <span class="shop-item__price-final">{{ item.price }}</span>
          </ng-template>
          <span class="shop-item__currency">💰</span>
        </div>
      </div>

      <!-- Action -->
      <div class="shop-item__footer">
        <app-button
          [variant]="purchased ? 'ghost' : 'primary'"
          size="sm"
          [disabled]="purchased"
          (buttonClick)="onPurchase()"
          [attr.aria-label]="'Comprar ' + item.name"
        >
          {{ purchased ? '✓ Possuído' : '🛒 Comprar' }}
        </app-button>
      </div>
    </app-card>
  `,
  styles: [
    `
      app-card {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .shop-item__header {
        position: relative;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--surface-tertiary);
      }

      .shop-item__icon {
        font-size: 56px;
        text-align: center;
        margin-bottom: 8px;
        line-height: 1;
      }

      .shop-item__badge {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 4px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }

      .shop-item__badge--common {
        background: var(--game-common, #888);
        color: white;
      }

      .shop-item__badge--rare {
        background: var(--game-rare, #4a90e2);
        color: white;
      }

      .shop-item__badge--epic {
        background: var(--game-epic, #9b59b6);
        color: white;
      }

      .shop-item__badge--legendary {
        background: var(--game-legendary, #f39c12);
        color: white;
      }

      .shop-item__new-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--brand-neon);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 4px;
        animation: pulse 2s ease-in-out infinite;
      }

      .shop-item__content {
        flex: 1;
        margin-bottom: 16px;
      }

      .shop-item__name {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .shop-item__description {
        margin: 0 0 12px 0;
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.4;
      }

      .shop-item__category {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        background: var(--surface-secondary);
        color: var(--text-secondary);
        padding: 4px 8px;
        border-radius: 4px;
        margin-bottom: 12px;
        text-transform: uppercase;
      }

      .shop-item__price {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding: 12px;
        background: var(--surface-secondary);
        border-radius: 8px;
        font-weight: 600;
      }

      .price-section--discount {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .shop-item__price-original {
        font-size: 13px;
        color: var(--text-secondary);
        text-decoration: line-through;
      }

      .shop-item__price-final {
        font-size: 20px;
        color: var(--brand-neon);
        font-weight: 700;
      }

      .shop-item__discount {
        font-size: 12px;
        background: var(--game-danger);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
      }

      .shop-item__currency {
        font-size: 18px;
        margin-left: auto;
      }

      .shop-item__footer {
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid var(--surface-tertiary);
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @media (max-width: 640px) {
        .shop-item__icon {
          font-size: 48px;
        }

        .shop-item__price-final {
          font-size: 18px;
        }
      }
    `,
  ],
})
export class AppShopItemComponent {
  @Input() item!: ShopItem;
  @Input() purchased = false;
  @Output() purchase = new EventEmitter<ShopItem>();

  rarityLabel(): string {
    const labels: Record<ShopItem['rarity'], string> = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário',
    };
    return labels[this.item.rarity];
  }

  categoryLabel(): string {
    const labels: Record<ShopItem['category'], string> = {
      cosmetic: 'Cosmético',
      boost: 'Impulso',
      theme: 'Tema',
      badge: 'Placa',
    };
    return labels[this.item.category];
  }

  finalPrice(): number {
    if (!this.item.discount) return this.item.price;
    return Math.floor(this.item.price * (1 - this.item.discount / 100));
  }

  onPurchase(): void {
    this.purchase.emit(this.item);
  }
}

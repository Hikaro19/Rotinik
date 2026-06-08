import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopItem } from '../../../../features/shop/services/shop.service';
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
        <div class="shop-item__icon">
          <ng-container *ngIf="isGraphicItem(item); else textIcon">
            <div class="shop-item__graphic-container">
              <div class="shop-item__graphic-circle"
                   [style.background]="(item.category === 'background' || item.category === 'navbar') ? item.icon : 'rgba(255,255,255,0.1)'"
                   [style.border]="item.category === 'border' ? item.icon : 'none'">
              </div>
            </div>
          </ng-container>
          <ng-template #textIcon>
            <ng-container *ngIf="isImageUrl(item.icon); else emojiIcon">
              <img [src]="item.icon" [alt]="item.name" class="shop-item__image" />
            </ng-container>
            <ng-template #emojiIcon>
              {{ item.icon }}
            </ng-template>
          </ng-template>
        </div>
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
          *ngIf="!purchased"
          variant="primary"
          size="sm"
          (buttonClick)="onPurchase()"
          [attr.aria-label]="'Comprar ' + item.name"
        >
          🛒 Comprar
        </app-button>

        <app-button
          *ngIf="purchased"
          [variant]="item.isEquipped ? 'ghost' : 'primary'"
          size="sm"
          (buttonClick)="onEquip()"
          [attr.aria-label]="item.isEquipped ? 'Desequipar ' + item.name : 'Equipar ' + item.name"
        >
          {{ item.isEquipped ? '✓ Equipado' : '👕 Equipar' }}
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
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 56px;
        text-align: center;
        margin-bottom: 8px;
        line-height: 1;
        min-height: 64px;
      }

      .shop-item__graphic-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 64px;
      }

      .shop-item__graphic-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        box-sizing: content-box;
      }

      .shop-item__image {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
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
        display: flex;
        flex-direction: column;
        gap: 8px;
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
  @Output() equip = new EventEmitter<ShopItem>();

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
    const labels: Record<string, string> = {
      avatar: 'Avatar',
      border: 'Borda',
      level_icon: 'Ícone',
      background: 'Fundo',
      navbar: 'NavBar',
    };
    return labels[this.item.category] || this.item.category;
  }

  finalPrice(): number {
    if (!this.item.discount) return this.item.price;
    return Math.floor(this.item.price * (1 - this.item.discount / 100));
  }

  onPurchase(): void {
    this.purchase.emit(this.item);
  }

  onEquip(): void {
    this.equip.emit(this.item);
  }

  isGraphicItem(item: ShopItem): boolean {
    return ['border', 'background', 'navbar'].includes(item.category);
  }

  isImageUrl(icon: string): boolean {
    if (!icon) return false;
    return icon.startsWith('http') || icon.startsWith('assets/') || icon.startsWith('/');
  }
}

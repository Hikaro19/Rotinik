import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  rarity: string;
  discount?: number | null;
  isNew: boolean;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/shop`; 

  // Mapeia a rota: GET /api/shop/items
  getCatalog(): Observable<ShopItem[]> {
    return this.http.get<ShopItem[]>(`${this.apiUrl}/items`);
  }

  // Mapeia a rota: POST /api/shop/items/{id}/purchase
  purchaseItem(itemId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/items/${itemId}/purchase`, {});
  }
}
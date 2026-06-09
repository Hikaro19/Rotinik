import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Medal {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  triggerType: number;
  targetValue: number;
}

export interface UserMedal {
  id: number;
  userId: number;
  medalId: number;
  medal: Medal;
  achievedAt: Date;
  isEquipped: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MedalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/medal`;

  getAllMedals(): Observable<{ data: Medal[] }> {
    return this.http.get<{ data: Medal[] }>(`${this.apiUrl}/all`);
  }

  getMyMedals(): Observable<{ data: UserMedal[] }> {
    return this.http.get<{ data: UserMedal[] }>(`${this.apiUrl}/me`);
  }

  equipMedals(medalIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/equip`, { medalIds });
  }
}

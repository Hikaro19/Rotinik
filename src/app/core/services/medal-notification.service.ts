import { Injectable, signal } from '@angular/core';

export interface MedalEarnedInfo {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  rewardPoints: number; // XP
  rewardCoins: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedalNotificationService {
  private queue: MedalEarnedInfo[] = [];
  
  // O signal guarda a medalha atualmente sendo exibida (ou null)
  readonly currentMedal = signal<MedalEarnedInfo | null>(null);

  addMedals(medals: any[]): void {
    if (!medals || medals.length === 0) return;

    const newMedals = medals.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      iconUrl: m.iconUrl,
      rewardPoints: m.rewardPoints || 50, // Fallback visual
      rewardCoins: m.rewardCoins || 20,
    }));

    this.queue.push(...newMedals);
    
    // Se não tiver nenhuma sendo exibida agora, puxa a próxima
    if (this.currentMedal() === null) {
      this.showNext();
    }
  }

  dismissCurrent(): void {
    this.currentMedal.set(null);
    setTimeout(() => {
      this.showNext();
    }, 300); // pequeno atraso para a animação de saída terminar
  }

  private showNext(): void {
    if (this.queue.length > 0) {
      const nextMedal = this.queue.shift();
      if (nextMedal) {
        this.currentMedal.set(nextMedal);
      }
    }
  }
}

import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedalEarnedInfo, MedalNotificationService } from '@core/services/medal-notification.service';
import { AppButtonComponent } from '../../ui/button/button.component';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-medal-earned-modal',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  templateUrl: './medal-earned-modal.component.html',
  styleUrl: './medal-earned-modal.component.scss'
})
export class MedalEarnedModalComponent {
  private readonly notificationService = inject(MedalNotificationService);
  
  readonly currentMedal = this.notificationService.currentMedal;

  constructor() {
    effect(() => {
      const medal = this.currentMedal();
      if (medal) {
        this.triggerConfetti();
      }
    });
  }

  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#d8b4fe', '#f1c40f', '#f39c12']
    });
  }

  dismiss() {
    this.notificationService.dismissCurrent();
  }
}

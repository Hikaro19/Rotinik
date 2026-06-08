import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medal, UserMedal } from '../../../../core/services/medal.service';

@Component({
  selector: 'app-achievements-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements-modal.component.html',
  styleUrl: './achievements-modal.component.scss'
})
export class AchievementsModalComponent {
  @Input() allMedals: Medal[] = [];
  @Input() myMedals: UserMedal[] = [];
  @Input() isPremium: boolean = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number[]>();

  // Use a local copy for editing
  localEquippedIds: number[] = [];

  ngOnInit() {
    // Initialize equipped ids
    this.localEquippedIds = this.myMedals.filter(m => m.isEquipped).map(m => m.medalId);
  }

  isUnlocked(medalId: number): boolean {
    return this.myMedals.some(um => um.medalId === medalId);
  }

  isEquipped(medalId: number): boolean {
    return this.localEquippedIds.includes(medalId);
  }

  toggleEquip(medalId: number) {
    if (!this.isUnlocked(medalId)) return;

    if (this.isEquipped(medalId)) {
      this.localEquippedIds = this.localEquippedIds.filter(id => id !== medalId);
    } else {
      const limit = this.isPremium ? 6 : 3;
      if (this.localEquippedIds.length >= limit) {
        // Remove the first one or simply alert?
        // Let's remove the oldest added one to make space
        this.localEquippedIds.shift();
      }
      this.localEquippedIds.push(medalId);
    }
  }

  formatUnlockedDate(medalId: number): string | null {
    const um = this.myMedals.find(um => um.medalId === medalId);
    if (!um) return null;
    return new Date(um.achievedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  }

  onSave() {
    this.save.emit(this.localEquippedIds);
  }
}

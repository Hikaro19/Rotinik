import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedalService, Medal, UserMedal } from '../../../../core/services/medal.service';
import { forkJoin } from 'rxjs';
import { AchievementsModalComponent } from '../achievements-modal/achievements-modal.component';
import { ProfileFacadeService } from '../../services/profile-facade.service';

@Component({
  selector: 'app-profile-achievements',
  standalone: true,
  imports: [CommonModule, AchievementsModalComponent],
  templateUrl: './profile-achievements.component.html',
  styleUrl: './profile-achievements.component.scss',
})
export class ProfileAchievementsComponent implements OnInit {
  private medalService = inject(MedalService);
  private profileFacade = inject(ProfileFacadeService);

  @Output() medalsLoaded = new EventEmitter<{ unlocked: number, total: number }>();

  allMedals = signal<Medal[]>([]);
  myMedals = signal<UserMedal[]>([]);
  showModal = signal<boolean>(false);

  readonly isPremium = this.profileFacade.isPremium;
  
  // Computes how many slots are available
  get maxSlots(): number {
    return this.isPremium() ? 5 : 3;
  }

  // Gets equipped medals to show in vitrine
  get equippedMedals(): UserMedal[] {
    return this.myMedals().filter(um => um.isEquipped).slice(0, this.maxSlots);
  }

  // Returns array of empty slots to render
  get emptySlots(): number[] {
    const emptyCount = Math.max(0, this.maxSlots - this.equippedMedals.length);
    return Array.from({ length: emptyCount }, (_, i) => i);
  }

  ngOnInit() {
    this.loadMedals();
  }

  loadMedals() {
    forkJoin({
      all: this.medalService.getAllMedals(),
      mine: this.medalService.getMyMedals()
    }).subscribe(({ all, mine }) => {
      this.allMedals.set(all.data);
      this.myMedals.set(mine.data);
      this.medalsLoaded.emit({ unlocked: mine.data.length, total: all.data.length });
    });
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveEquippedMedals(medalIds: number[]) {
    this.medalService.equipMedals(medalIds).subscribe({
      next: () => {
        // Reload to sync changes
        this.loadMedals();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving medals:', err);
      }
    });
  }
}

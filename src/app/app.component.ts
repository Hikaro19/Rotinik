import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RoutineService } from './core/services/routine.service';
import { ProfileService } from './core/services/profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'Rotinik';

  private readonly routineService = inject(RoutineService);
  private readonly profileService = inject(ProfileService);

  ngOnInit(): void {
    this.routineService.initialize();
    this.profileService.initialize();
  }
}

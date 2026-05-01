import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RoutineService } from './core/services/routine.service';
import { ProfileService } from './core/services/profile.service';
import { AuthService } from './core/services/auth.service';

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
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.routineService.initialize();
    this.profileService.initialize();
  }
}

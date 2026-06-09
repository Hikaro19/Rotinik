import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';
import { MedalEarnedModalComponent } from '@shared/components/feature/medal-earned-modal/medal-earned-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MedalEarnedModalComponent],
  template: `
    <router-outlet></router-outlet>
    <app-medal-earned-modal></app-medal-earned-modal>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Rotinik';
  private themeService = inject(ThemeService);
  private authFacade = inject(AuthFacadeService);

  constructor() {
    effect(() => {
      // Re-aplica o tema toda vez que a session for atualizada
      this.authFacade.session();
      this.themeService.applyCosmetics();
    });
  }
}

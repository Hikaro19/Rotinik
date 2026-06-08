import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
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

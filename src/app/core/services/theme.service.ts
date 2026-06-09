import { Injectable, inject } from '@angular/core';
import { AuthFacadeService } from '@features/users/services/auth-facade.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private authFacade = inject(AuthFacadeService);

  /**
   * Applies the user's equipped cosmetics as CSS variables on the document body.
   */
  applyCosmetics(): void {
    const session = this.authFacade.session();
    const user = session?.user;
    
    if (!user || !user.equippedCosmetics) {
      this.clearCosmetics();
      return;
    }

    const cosmetics = user.equippedCosmetics;

    // Background
    if (cosmetics['background']) {
      document.body.style.setProperty('--cosmetic-bg', cosmetics['background']);
    } else {
      document.body.style.removeProperty('--cosmetic-bg');
    }

    // Navbar
    if (cosmetics['navbar']) {
      document.body.style.setProperty('--cosmetic-navbar', cosmetics['navbar']);
    } else {
      document.body.style.removeProperty('--cosmetic-navbar');
    }
  }

  /**
   * Applies a specific cosmetic CSS variable to the document body.
   */
  applyCosmetic(category: string, value: string | null): void {
    if (category === 'background') {
      if (value) document.body.style.setProperty('--cosmetic-bg', value);
      else document.body.style.removeProperty('--cosmetic-bg');
    }
    if (category === 'navbar') {
      if (value) document.body.style.setProperty('--cosmetic-navbar', value);
      else document.body.style.removeProperty('--cosmetic-navbar');
    }
  }

  /**
   * Clears applied cosmetics.
   */
  clearCosmetics(): void {
    document.body.style.removeProperty('--cosmetic-bg');
    document.body.style.removeProperty('--cosmetic-navbar');
  }
}

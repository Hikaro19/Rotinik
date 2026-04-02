import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Header Fixed -->
    <header class="app-header">
      <div class="header-left">
        <button class="back-btn" (click)="goBack()" *ngIf="canGoBack">
          <span>‹</span>
        </button>
      </div>

      <div class="header-center">
        <h1 class="header-title">{{ currentPageTitle }}</h1>
      </div>

      <div class="header-right">
        <button class="menu-btn" (click)="toggleMenu()">
          <span>≡</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="app-main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Bottom Navigation Bar Fixed -->
    <nav class="bottom-nav">
      <a 
        class="nav-item" 
        routerLink="/home"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Home</span>
      </a>

      <a 
        class="nav-item" 
        routerLink="/friends/leaderboard"
        routerLinkActive="active">
        <span class="nav-icon">🔍</span>
        <span class="nav-label">Stats</span>
      </a>

      <a 
        class="nav-item" 
        routerLink="/routines"
        routerLinkActive="active">
        <span class="nav-icon">↔️</span>
        <span class="nav-label">Rotinas</span>
      </a>

      <a 
        class="nav-item" 
        routerLink="/shop"
        routerLinkActive="active">
        <span class="nav-icon">🏪</span>
        <span class="nav-label">Loja</span>
      </a>

      <a 
        class="nav-item" 
        routerLink="/profile"
        routerLinkActive="active">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Perfil</span>
      </a>
    </nav>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: var(--bg-card, #1C1C26);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 100;
    }

    .header-left,
    .header-right {
      flex: 0 0 auto;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-center {
      flex: 1;
      text-align: center;
      padding: 0 16px;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--purple-neon, #D946EF);
      margin: 0;
    }

    .back-btn,
    .menu-btn {
      background: none;
      border: none;
      color: var(--text-primary, #FFFFFF);
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .back-btn:hover,
    .menu-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .back-btn:active,
    .menu-btn:active {
      background-color: rgba(255, 255, 255, 0.15);
    }

    .app-main-content {
      flex: 1;
      margin-top: 64px;
      margin-bottom: 80px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: var(--purple-primary, #9B51E0);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
    }

    .nav-item {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      transition: color 0.2s ease;
      position: relative;
    }

    .nav-item:hover {
      color: var(--text-primary, #FFFFFF);
    }

    .nav-item.active {
      color: var(--text-primary, #FFFFFF);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--text-primary, #FFFFFF);
      border-radius: 0 0 3px 3px;
    }

    .nav-icon {
      font-size: 20px;
      line-height: 1;
    }

    .nav-label {
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
    }

    /* Responsividade */
    @media (max-width: 480px) {
      .nav-label {
        display: none;
      }

      .bottom-nav {
        height: 60px;
      }

      .app-main-content {
        margin-bottom: 60px;
      }
    }
  `],
})
export class LayoutComponent implements OnInit {
  private location = inject(Location);
  private router = inject(Router);

  currentPageTitle = 'Home';
  canGoBack = false;

  ngOnInit() {
    this.updatePageTitle();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  private updatePageTitle() {
    const urlSegments = this.router.url.split('/').filter((s) => s);
    if (urlSegments.length === 0 || urlSegments[0] === 'home') {
      this.currentPageTitle = 'Bem-vindo';
    } else if (urlSegments[0] === 'routines' && urlSegments.length > 1) {
      // Handle /routines/:id - map ID to routine name
      const routineId = urlSegments[1];
      this.currentPageTitle = this.getRoutineNameById(routineId);
    } else {
      this.currentPageTitle = this.getTitleForRoute(urlSegments[0]);
    }

    // Verificar se pode voltar
    this.canGoBack = window.history.length > 1;
  }

  private getRoutineNameById(id: string): string {
    const routineMap: { [key: string]: string } = {
      '1': 'Rotina De Estudos',
      '2': 'Saúde Física',
      '3': 'Exercícios Matinais',
      '4': 'Leitura Diária',
    };
    return routineMap[id] || 'Rotina De Estudos';
  }

  private getTitleForRoute(route: string): string {
    const titles: { [key: string]: string } = {
      'friends': 'Amigos',
      'leaderboard': 'Classificação',
      'feed': 'Feed',
      'profile': 'Perfil',
      'routines': 'Rotinas',
      'routine-detail': 'Detalhes',
      'tasks': 'Tarefas',
      'shop': 'Loja',
      'options': 'Mais Opções',
    };
    return titles[route] || route.charAt(0).toUpperCase() + route.slice(1);
  }

  goBack() {
    this.location.back();
  }

  toggleMenu() {
    this.router.navigate(['/options']);
  }
}

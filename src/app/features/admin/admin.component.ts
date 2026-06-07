import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export interface AdminCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);

  adminName = '';
  adminCards: AdminCard[] = [];

  ngOnInit(): void {
    const session = this.authService.getCurrentSession();
    this.adminName = session?.user?.name || 'Administrador';

    this.adminCards = [
      {
        id: 'manage-users',
        title: 'Gerenciar Usuários',
        description: 'Visualizar e editar usuários.',
        icon: '👥',
        url: '#',
      },
      {
        id: 'manage-routines',
        title: 'Gerenciar Rotinas',
        description: 'Visualizar, criar e editar rotinas.',
        icon: '🔁',
        url: '#',
      },
      {
        id: 'medals',
        title: 'Medalhas',
        description: 'Visualizar, criar e editar medalhas.',
        icon: '🏅',
        url: '#',
      },
      {
        id: 'shop-items',
        title: 'Itens da loja',
        description: 'Visualizar, criar e editar itens da loja.',
        icon: '🛍️',
        url: '#',
      },
    ];
  }
}

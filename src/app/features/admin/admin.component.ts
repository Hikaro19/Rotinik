import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService } from '@core/services/auth.service';

export interface AdminCard {
  id: 'manage-users' | 'manage-routines' | 'medals' | 'shop-items';
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  adminName = '';
  adminCards: AdminCard[] = [];
  
  // Controle de Seções Ativas
  activeSection: 'dashboard' | 'users' | 'routines' | 'medals' | 'shop' = 'dashboard';
  isLoading = false;
  searchQuery = '';

  // Arrays de Dados
  usersList: any[] = [];
  routinesList: any[] = [];
  medalsList: any[] = [];
  shopItemsList: any[] = [];

  // Paginação de Usuários
  userPage = 1;
  userPageSize = 10;
  userTotalCount = 0;

  // Controle de Modais & Item Selecionado
  showModal = false;
  modalType: 'user' | 'template' | 'medal' | 'shop' = 'user';
  modalAction: 'create' | 'edit' = 'create';
  selectedItem: any = {};

  ngOnInit(): void {
    const session = this.authService.getCurrentSession();
    this.adminName = session?.user?.name || 'Administrador';

    this.adminCards = [
      {
        id: 'manage-users',
        title: 'Gerenciar Usuários',
        description: 'Visualizar, editar, alterar saldos e banir usuários.',
        icon: '👥',
      },
      {
        id: 'manage-routines',
        title: 'Gerenciar Rotinas',
        description: 'Visualizar e criar rotinas modelo (templates).',
        icon: '🔁',
      },
      {
        id: 'medals',
        title: 'Medalhas',
        description: 'Visualizar, cadastrar e excluir medalhas.',
        icon: '🏅',
      },
      {
        id: 'shop-items',
        title: 'Itens da loja',
        description: 'Visualizar, cadastrar e gerenciar cosméticos da loja.',
        icon: '🛍️',
      },
    ];
  }

  // Navegação
  navigateTo(section: 'dashboard' | 'users' | 'routines' | 'medals' | 'shop'): void {
    this.activeSection = section;
    this.searchQuery = '';
    
    if (section === 'users') this.fetchUsers();
    if (section === 'routines') this.fetchRoutines();
    if (section === 'medals') this.fetchMedals();
    if (section === 'shop') this.fetchShopItems();
  }

  getTriggerTypeLabel(type: number): string {
    if (type === 0) return 'Tarefas Concluídas';
    if (type === 1) return 'Streak';
    return 'XP Total';
  }

  getSectionTitle(section: string): string {
    switch (section) {
      case 'users': return '👥 Gerenciar Usuários';
      case 'routines': return '🔁 Modelos de Rotina';
      case 'medals': return '🏅 Medalhas e Achievements';
      case 'shop': return '🛍️ Itens da Loja';
      default: return '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // --- API FETCHES ---

  fetchUsers(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/user/admin/users?search=${this.searchQuery}&page=${this.userPage}&pageSize=${this.userPageSize}`)
      .subscribe({
        next: (res) => {
          this.usersList = res.items || [];
          this.userTotalCount = res.totalCount || 0;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  fetchRoutines(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/routine/admin/all`)
      .subscribe({
        next: (res) => {
          this.routinesList = res || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  fetchMedals(): void {
    this.isLoading = true;
    this.http.get<{ data: any[] }>(`${this.apiUrl}/medal/all`)
      .subscribe({
        next: (res) => {
          this.medalsList = res.data || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  fetchShopItems(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/shop/items`)
      .subscribe({
        next: (res) => {
          this.shopItemsList = res || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  // --- CRUD MODALS & ACTIONS ---

  openEditModal(type: typeof this.modalType, item: any): void {
    this.modalType = type;
    this.modalAction = 'edit';
    this.selectedItem = { ...item };
    this.showModal = true;
  }

  openCreateModal(type: typeof this.modalType): void {
    this.modalType = type;
    this.modalAction = 'create';
    this.selectedItem = {};
    if (type === 'template') {
      this.selectedItem.tasks = [{ title: '', description: '', importance: 'media', xpReward: 10, coinReward: 5 }];
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = {};
  }

  addTaskToTemplate(): void {
    if (!this.selectedItem.tasks) this.selectedItem.tasks = [];
    this.selectedItem.tasks.push({ title: '', description: '', importance: 'media', xpReward: 10, coinReward: 5 });
  }

  removeTaskFromTemplate(index: number): void {
    this.selectedItem.tasks.splice(index, 1);
  }

  saveChanges(): void {
    this.isLoading = true;
    const headers = { 'Content-Type': 'application/json' };

    if (this.modalType === 'user') {
      this.http.put(`${this.apiUrl}/user/admin/users/${this.selectedItem.id}`, this.selectedItem, { headers })
        .subscribe(() => {
          this.fetchUsers();
          this.closeModal();
        });
    }
    else if (this.modalType === 'template') {
      if (this.modalAction === 'create') {
        this.http.post(`${this.apiUrl}/routine/admin/templates`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchRoutines();
            this.closeModal();
          });
      } else {
        this.http.put(`${this.apiUrl}/routine/admin/templates/${this.selectedItem.id}`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchRoutines();
            this.closeModal();
          });
      }
    }
    else if (this.modalType === 'medal') {
      if (this.modalAction === 'create') {
        this.http.post(`${this.apiUrl}/medal/admin`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchMedals();
            this.closeModal();
          });
      } else {
        this.http.put(`${this.apiUrl}/medal/admin/${this.selectedItem.id}`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchMedals();
            this.closeModal();
          });
      }
    }
    else if (this.modalType === 'shop') {
      if (this.modalAction === 'create') {
        this.http.post(`${this.apiUrl}/shop/admin/items`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchShopItems();
            this.closeModal();
          });
      } else {
        this.http.put(`${this.apiUrl}/shop/admin/items/${this.selectedItem.id}`, this.selectedItem, { headers })
          .subscribe(() => {
            this.fetchShopItems();
            this.closeModal();
          });
      }
    }
  }

  deleteItem(type: typeof this.modalType, id: number): void {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    this.isLoading = true;
    let url = '';
    if (type === 'template') url = `${this.apiUrl}/routine/admin/templates/${id}`;
    if (type === 'medal') url = `${this.apiUrl}/medal/admin/${id}`;
    if (type === 'shop') url = `${this.apiUrl}/shop/admin/items/${id}`;

    this.http.delete(url).subscribe(() => {
      if (type === 'template') this.fetchRoutines();
      if (type === 'medal') this.fetchMedals();
      if (type === 'shop') this.fetchShopItems();
    });
  }

  toggleUserBan(user: any): void {
    const action = user.isBanned ? 'desbanir' : 'banir';
    if (!confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) return;

    this.isLoading = true;
    const updatedUser = {
      ...user,
      isBanned: !user.isBanned
    };

    this.http.put(`${this.apiUrl}/user/admin/users/${user.id}`, updatedUser)
      .subscribe(() => {
        this.fetchUsers();
      });
  }
}

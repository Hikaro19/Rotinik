import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RotatinaRepository } from './core/services';

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

  // Injeta repositório para inicializar seed data
  private rotinaRepo = inject(RotatinaRepository);

  ngOnInit(): void {
    // Popula o banco de dados em memória com dados iniciais
    this.rotinaRepo.seedData();
  }
}

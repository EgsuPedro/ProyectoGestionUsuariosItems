import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar bg-white border-end shadow-sm " >
      <div class="p-3 " >
        <h6 class="text-uppercase text-muted fw-bold small px-3 mb-3">Navegación</h6>
        <ul class="nav nav-pills flex-column gap-1">
          <li class="nav-item">
            <a
              routerLink="/usuarios"
              routerLinkActive="active"
              class="nav-link text-dark d-flex align-items-center gap-2">
              <i class="bi bi-people"></i> Usuarios
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/items"
              routerLinkActive="active"
              class="nav-link text-dark d-flex align-items-center gap-2">
              <i class="bi bi-grid"></i> Ítems
            </a>
          </li>
          <li class="nav-item">
            <a
              routerLink="/asignaciones"
              routerLinkActive="active"
              class="nav-link text-dark d-flex align-items-center gap-2">
              <i class="bi bi-link-45deg"></i> Asignaciones
            </a>
          </li>
        </ul>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-height: calc(100vh - 60px);
    }
    .nav-link {
      border-radius: 0.375rem;
      padding: 0.6rem 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .nav-link.active {
      background-color: #0d6efd !important;
      color: #fff !important;
    }
    .nav-link:hover:not(.active) {
      background-color: #f8f9fa;
    }
  `]
})
export class SidebarComponent {}
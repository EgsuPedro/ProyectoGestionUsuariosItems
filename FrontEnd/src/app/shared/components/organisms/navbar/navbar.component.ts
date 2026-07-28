import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
      <div class="container-fluid">
        <span class="navbar-brand fw-bold text-primary">
          <i class="bi bi-box-seam me-2"></i>Gestión UI
        </span>

        <div class="d-flex align-items-center gap-3 ms-auto">
          @if (user()) {
            <div class="text-end text-light">
              <div class="fw-semibold small">{{ user()?.nombreCompleto }}</div>
              <app-badge [status]="user()?.rol || ''">{{ user()?.rol }}</app-badge>
            </div>
          }

          <app-button
            type="button"
            variant="outline-primary"
            (onClick)="onLogout()">
            Cerrar Sesión
          </app-button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 60px;
      z-index: 1030;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);

  // Signal del usuario autenticado
  user = this.authService.currentUser;

  onLogout(): void {
    this.authService.logout();
  }
}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, // <-- AGREGAR AQUÍ
    NavbarComponent, 
    SidebarComponent
  ],
  template: `
    <div class="layout-wrapper d-flex flex-column min-vh-100" >
      <!-- Navbar Superior -->
      <app-navbar></app-navbar>

      <!-- Cuerpo del Panel (Sidebar + Contenido Principal) -->
      <div class="d-flex flex-grow-1">
        <app-sidebar></app-sidebar>

        <main class="main-content flex-grow-1 p-4 bg-light">
          <div class="container-fluid">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      overflow-x: hidden;
    }
    .main-content {
      min-height: calc(100vh - 60px);
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent {}
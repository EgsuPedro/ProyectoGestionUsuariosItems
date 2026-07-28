import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/components/templates/main-layout/main-layout.component';

export const routes: Routes = [
  // Ruta pública: Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },

  // Rutas protegidas dentro del MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios-list-page/usuarios-list-page.component').then(
            (m) => m.UsuariosListPageComponent
          )
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./pages/items/items-list-page/items-list-page.component').then(
            (m) => m.ItemsListPageComponent
          )
      },
      {
        path: 'asignaciones',
        loadComponent: () =>
          import('./pages/asignaciones/asignaciones-page/asignaciones-page.component').then(
            (m) => m.AsignacionesPageComponent
          )
      },
      // Redirección por defecto en la raíz protegida
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      }
    ]
  },

  // Comodín para rutas no encontradas (404)
  {
    path: '**',
    redirectTo: 'login'
  }
];
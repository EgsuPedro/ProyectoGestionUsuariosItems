import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // <-- Agregado para protección de SSR
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, UserSession } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); // <-- Identifica si corremos en SSR o Browser
  private readonly apiUrl = `${environment.apiUrls.authUsuarios}/auth`;

  // Signal reactivo para el estado del usuario autenticado
  currentUser = signal<UserSession | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const session: UserSession = {
          idUsuario: response.idUsuario,
          nombreCompleto: response.nombreCompleto,
          email: response.email,
          rol: response.rol,
          token: response.token
        };
        
        // Guardar sesión en el almacenamiento local de forma segura y actualizar el Signal
        this.saveUserToStorage(session);
        this.currentUser.set(session);
      })
    );
  }

  logout(): void {
    this.removeUserFromStorage();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  // --- MÉTODOS SEGUROS PARA LOCALSTORAGE (Compatibles con SSR) ---

  private getUserFromStorage(): UserSession | null {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('user_session');
      if (!saved) return null;
      try {
        return JSON.parse(saved) as UserSession;
      } catch {
        return null;
      }
    }
    return null; // En servidor (SSR) retorna null sin romper la app
  }

  private saveUserToStorage(session: UserSession): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_session', JSON.stringify(session));
    }
  }

  private removeUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_session');
    }
  }
}
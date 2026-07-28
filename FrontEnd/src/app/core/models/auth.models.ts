export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  rol: string;
  token: string;
  expiracion: string;
}

export interface UserSession {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  rol: string;
  token: string;
}
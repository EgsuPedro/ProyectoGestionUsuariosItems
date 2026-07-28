export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
}

export interface UpdateUsuarioRequest {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: boolean;
}
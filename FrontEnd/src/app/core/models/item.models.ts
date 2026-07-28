export interface Item {
  idItem: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  fechaCreacion: string;
}

export interface CreateItemRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface UpdateItemRequest {
  idItem: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
}
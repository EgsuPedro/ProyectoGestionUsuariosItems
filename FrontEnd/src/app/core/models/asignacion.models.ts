export interface Asignacion {
  idAsignacion: number;
  idUsuario: number;
  nombreUsuario?: string;
  idItem: number;
  nombreItem?: string;
  codigoItem?: string;
  fechaAsignacion: string;
  observacion?: string;
  estado: boolean;
}

export interface CreateAsignacionRequest {
  idUsuario: number;
  idItem: number;
  observacion?: string;
}
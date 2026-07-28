import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asignacion, CreateAsignacionRequest } from '../models/asignacion.models';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrls.asignaciones}/asignaciones`;

  getAll(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl);
  }

  getByUsuario(idUsuario: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  assign(request: CreateAsignacionRequest): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, request);
  }

  unassign(idAsignacion: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAsignacion}`);
  }
}
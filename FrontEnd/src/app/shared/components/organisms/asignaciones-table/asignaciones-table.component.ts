import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Asignacion } from '../../../../core/models/asignacion.models';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-asignaciones-table',
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  template: `
    <div class="table-responsive bg-white rounded shadow-sm border">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col"># ID</th>
            <th scope="col">Código Ítem</th>
            <th scope="col">Ítem Asignado</th>
            <th scope="col">Fecha Asignación</th>
            <th scope="col">Observaciones</th>
            <th scope="col" class="text-end px-4">Acción</th>
          </tr>
        </thead>
        <tbody>
          @for (asig of asignaciones(); track asig.idAsignacion) {
            <tr>
              <td class="fw-bold">#{{ asig.idAsignacion }}</td>
              <td>
                <span class="badge bg-secondary font-monospace">{{ asig.codigoItem || 'N/A' }}</span>
              </td>
              <td class="fw-semibold">{{ asig.nombreItem || ('Ítem #' + asig.idItem) }}</td>
              <td>{{ asig.fechaAsignacion | date:'mediumDate' }}</td>
              <td class="text-muted small">{{ asig.observacion || 'Sin observaciones' }}</td>
              <td class="text-end px-4">
                <app-button
                  type="button"
                  variant="danger"
                  (onClick)="onUnassign.emit(asig.idAsignacion)">
                  <i class="bi bi-x-circle me-1"></i> Desasignar
                </app-button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="text-center py-4 text-muted">
                @if (hasSelectedUser()) {
                  Este usuario no tiene ítems asignados actualmente.
                } @else {
                  Selecciona un usuario en el panel superior para consultar sus asignaciones.
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AsignacionesTableComponent {
  asignaciones = input<Asignacion[]>([]);
  hasSelectedUser = input<boolean>(false);

  onUnassign = output<number>();
}
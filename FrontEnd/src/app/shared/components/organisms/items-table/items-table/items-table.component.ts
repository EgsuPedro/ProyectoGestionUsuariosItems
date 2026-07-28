import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../../../../../core/models/item.models';
import { BadgeComponent } from '../../../atoms/badge/badge.component';
import { ButtonComponent } from '../../../atoms/button/button.component';

@Component({
  selector: 'app-items-table',
  standalone: true,
  imports: [CurrencyPipe, BadgeComponent, ButtonComponent],
  template: `
    <div class="table-responsive bg-white rounded shadow-sm border">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Precio</th>
            <th scope="col">Estado</th>
            <th scope="col" class="text-end px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.idItem) {
            <tr>
              <td>
                <span class="badge bg-secondary font-monospace">{{ item.codigo }}</span>
              </td>
              <td class="fw-semibold">{{ item.nombre }}</td>
              <td class="text-muted small">
                {{ item.descripcion || 'Sin descripción' }}
              </td>
              <td class="fw-bold text-success">
                {{ item.precio | currency:'USD':'symbol':'1.2-2' }}
              </td>
              <td>
                <app-badge [status]="item.estado">
                  {{ item.estado ? 'Disponible' : 'Inactivo' }}
                </app-badge>
              </td>
              <td class="text-end px-4">
                <div class="btn-group gap-2">
                  <app-button
                    type="button"
                    variant="outline-primary"
                    (onClick)="onEdit.emit(item)">
                    <i class="bi bi-pencil me-1"></i> Editar
                  </app-button>
                  <app-button
                    type="button"
                    variant="danger"
                    (onClick)="onDelete.emit(item.idItem)">
                    <i class="bi bi-trash me-1"></i> Eliminar
                  </app-button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="text-center py-4 text-muted">
                No se encontraron ítems registrados o coincidentes con la búsqueda.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ItemsTableComponent {
  items = input<Item[]>([]);

  onEdit = output<Item>();
  onDelete = output<number>();
}
import { Component, input, output } from '@angular/core';
import { Usuario } from '../../../../core/models/usuario.models';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-usuarios-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent],
  template: `
    <div class="table-responsive bg-white rounded shadow-sm border">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col"># ID</th>
            <th scope="col">Nombre Completo</th>
            <th scope="col">Correo Electrónico</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col" class="text-end px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (user of usuarios(); track user.idUsuario) {
            <tr>
              <td class="fw-bold">#{{ user.idUsuario }}</td>
              <td>{{ user.nombre }} {{ user.apellido }}</td>
              <td>{{ user.email }}</td>
              <td>
                <app-badge [status]="user.rol">{{ user.rol }}</app-badge>
              </td>
              <td>
                <app-badge [status]="user.estado">
                  {{ user.estado ? 'Activo' : 'Inactivo' }}
                </app-badge>
              </td>
              <td class="text-end px-4">
                <div class="btn-group gap-2">
                  <app-button
                    type="button"
                    variant="outline-primary"
                    (onClick)="onEdit.emit(user)">
                    <i class="bi bi-pencil me-1"></i> Editar
                  </app-button>
                  <app-button
                    type="button"
                    variant="danger"
                    (onClick)="onDelete.emit(user.idUsuario)">
                    <i class="bi bi-trash me-1"></i> Eliminar
                  </app-button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="text-center py-4 text-muted">
                No hay usuarios registrados en el sistema.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class UsuariosTableComponent {
  usuarios = input<Usuario[]>([]);

  onEdit = output<Usuario>();
  onDelete = output<number>();
}
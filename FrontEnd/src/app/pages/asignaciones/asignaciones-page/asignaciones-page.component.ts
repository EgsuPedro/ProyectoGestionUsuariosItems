import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AsignacionesService } from '../../../core/services/asignaciones.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { ItemsService } from '../../../core/services/items.service';
import { Asignacion, CreateAsignacionRequest } from '../../../core/models/asignacion.models';
import { Usuario } from '../../../core/models/usuario.models';
import { Item } from '../../../core/models/item.models';
import { AsignacionFormCardComponent } from '../../../shared/components/organisms/asignacion-form-card/asignacion-form-card.component';
import { AsignacionesTableComponent } from '../../../shared/components/organisms/asignaciones-table/asignaciones-table.component';
import { SpinnerComponent } from '../../../shared/components/atoms/spinner/spinner.component';
import { AlertComponent } from '../../../shared/components/molecules/alert/alert.component';

@Component({
  selector: 'app-asignaciones-page',
  standalone: true,
  imports: [
    AsignacionFormCardComponent,
    AsignacionesTableComponent,
    SpinnerComponent,
    AlertComponent
  ],
  template: `
    <div class="mb-4">
      <h2 class="fw-bold text-dark m-0">Gestión de Asignaciones</h2>
      <p class="text-muted small m-0">Asocia ítems del catálogo a usuarios y administra su inventario asignado</p>
    </div>

    <app-alert [message]="alertMessage()" [type]="alertType()"></app-alert>

    @if (isLoadingInitial()) {
      <div class="d-flex justify-content-center py-5">
        <app-spinner message="Cargando catálogo de usuarios e ítems..."></app-spinner>
      </div>
    } @else {
      <!-- Formulario de Selección y Vinculación -->
      <app-asignacion-form-card
        [usuarios]="usuarios()"
        [items]="availableItems()"
        [selectedUserId]="selectedUserId()"
        [isSaving]="isSaving()"
        (onUsuarioSelected)="onSelectUser($event)"
        (onAssign)="handleAssign($event)">
      </app-asignacion-form-card>

      <!-- Tabla de resultados del usuario -->
      <div class="mb-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold m-0 text-secondary">
          Ítems Asignados
          @if (selectedUserId()) {
            <span class="text-primary">(Usuario #{{ selectedUserId() }})</span>
          }
        </h5>

        @if (isLoadingAsignaciones()) {
          <app-spinner size="sm" message="Actualizando listado..."></app-spinner>
        }
      </div>

      <app-asignaciones-table
        [asignaciones]="asignaciones()"
        [hasSelectedUser]="!!selectedUserId()"
        (onUnassign)="handleUnassign($event)">
      </app-asignaciones-table>
    }
  `
})
export class AsignacionesPageComponent implements OnInit {
  private asignacionesService = inject(AsignacionesService);
  private usuariosService = inject(UsuariosService);
  private itemsService = inject(ItemsService);

  // Signals de estado
  usuarios = signal<Usuario[]>([]);
  availableItems = signal<Item[]>([]);
  asignaciones = signal<Asignacion[]>([]);
  selectedUserId = signal<number | null>(null);

  isLoadingInitial = signal<boolean>(false);
  isLoadingAsignaciones = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoadingInitial.set(true);
    forkJoin({
      usuarios: this.usuariosService.getAll(),
      items: this.itemsService.getAll()
    }).subscribe({
      next: (res) => {
        this.usuarios.set(res.usuarios.filter(u => u.estado));
        this.availableItems.set(res.items.filter(i => i.estado));
        this.isLoadingInitial.set(false);
      },
      error: () => {
        this.showAlert('Error al cargar usuarios o ítems iniciales', 'danger');
        this.isLoadingInitial.set(false);
      }
    });
  }

  onSelectUser(userId: number): void {
    this.selectedUserId.set(userId);
    this.loadAsignacionesByUser(userId);
  }

  private loadAsignacionesByUser(userId: number): void {
    this.isLoadingAsignaciones.set(true);
    this.asignacionesService.getByUsuario(userId).subscribe({
      next: (data) => {
        this.asignaciones.set(data);
        this.isLoadingAsignaciones.set(false);
      },
      error: () => {
        this.showAlert('Error al cargar las asignaciones del usuario', 'danger');
        this.isLoadingAsignaciones.set(false);
      }
    });
  }

  handleAssign(request: CreateAsignacionRequest): void {
    this.isSaving.set(true);
    this.asignacionesService.assign(request).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showAlert('Ítem asignado exitosamente', 'success');
        this.loadAsignacionesByUser(request.idUsuario);
      },
      error: () => {
        this.isSaving.set(false);
        this.showAlert('No se pudo completar la asignación', 'danger');
      }
    });
  }

  handleUnassign(idAsignacion: number): void {
    if (confirm('¿Está seguro de que desea retirar esta asignación?')) {
      this.asignacionesService.unassign(idAsignacion).subscribe({
        next: () => {
          this.showAlert('Asignación removida con éxito', 'success');
          if (this.selectedUserId()) {
            this.loadAsignacionesByUser(this.selectedUserId()!);
          }
        },
        error: () => {
          this.showAlert('Error al retirar la asignación', 'danger');
        }
      });
    }
  }

  private showAlert(msg: string, type: 'success' | 'danger'): void {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(null), 4000);
  }
}
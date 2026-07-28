import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../../core/models/usuario.models';
import { UsuariosTableComponent } from '../../../shared/components/organisms/usuarios-table/usuarios-table.component';
import { UsuarioFormModalComponent } from '../../../shared/components/organisms/usuario-form-modal/usuario-form-modal.component';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { SpinnerComponent } from '../../../shared/components/atoms/spinner/spinner.component';
import { AlertComponent } from '../../../shared/components/molecules/alert/alert.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuarios-list-page',
  standalone: true,
  imports: [
    UsuariosTableComponent,
    UsuarioFormModalComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent
  ],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark m-0">Gestión de Usuarios</h2>
        <p class="text-muted small m-0">Administra los usuarios registrados en la plataforma</p>
      </div>
      <app-button type="button" variant="primary" (onClick)="openCreateModal()">
        <i class="bi bi-person-plus me-1"></i> Nuevo Usuario
      </app-button>
    </div>

    <app-alert [message]="alertMessage()" [type]="alertType()"></app-alert>

    @if (isLoading()) {
      <div class="d-flex justify-content-center py-5">
        <app-spinner message="Cargando usuarios..."></app-spinner>
      </div>
    } @else {
      <app-usuarios-table
        [usuarios]="usuarios()"
        (onEdit)="openEditModal($event)"
        (onDelete)="handleDelete($event)">
      </app-usuarios-table>
    }

    <app-usuario-form-modal
      [isOpen]="isModalOpen()"
      [isSaving]="isSaving()"
      [usuarioToEdit]="selectedUsuario()"
      (onClose)="closeModal()"
      (onSave)="handleSave($event)">
    </app-usuario-form-modal>
  `
})
export class UsuariosListPageComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios = signal<Usuario[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  selectedUsuario = signal<Usuario | null>(null);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading.set(true);
    this.usuariosService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.showAlert('Error al cargar la lista de usuarios', 'danger');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.selectedUsuario.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(user: Usuario): void {
    this.selectedUsuario.set(user);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUsuario.set(null);
  }

  handleSave(payload: CreateUsuarioRequest | UpdateUsuarioRequest): void {
    this.isSaving.set(true);

    if ('idUsuario' in payload) {
      // Edición
      this.usuariosService.update(payload.idUsuario, payload as UpdateUsuarioRequest).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.showAlert('Usuario actualizado con éxito', 'success');
          this.loadUsuarios();
        },
        error: () => {
          this.isSaving.set(false);
          this.showAlert('No se pudo actualizar el usuario', 'danger');
        }
      });
    } else {
      // Creación
      this.usuariosService.create(payload as CreateUsuarioRequest).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.showAlert('Usuario creado correctamente', 'success');
          this.loadUsuarios();
        },
        error: () => {
          this.isSaving.set(false);
          this.showAlert('Error al registrar el nuevo usuario', 'danger');
        }
      });
    }
  }

  handleDelete(idUsuario: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuariosService.delete(idUsuario).subscribe({
        next: () => {
          this.showAlert('Usuario eliminado correctamente', 'success');
          this.loadUsuarios();
        },
        error: () => {
          this.showAlert('No se pudo eliminar el usuario', 'danger');
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
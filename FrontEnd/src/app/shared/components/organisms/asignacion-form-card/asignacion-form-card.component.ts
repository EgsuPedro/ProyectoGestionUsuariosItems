import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../../core/models/usuario.models';
import { Item } from '../../../../core/models/item.models';
import { CreateAsignacionRequest } from '../../../../core/models/asignacion.models';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-asignacion-form-card',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="card-title fw-bold m-0">
          <i class="bi bi-link-45deg me-2"></i>Asignar Nuevo Ítem
        </h5>
      </div>
      <div class="card-body p-4">
        <form [formGroup]="asignacionForm" (ngSubmit)="handleSubmit()">
          <div class="row g-3">
            <!-- Selección de Usuario -->
            <div class="col-md-6">
              <label class="form-label fw-bold">1. Seleccionar Usuario</label>
              <select
                class="form-select"
                formControlName="idUsuario"
                (change)="onUserChange()">
                <option [ngValue]="null" disabled>-- Selecciona un usuario --</option>
                @for (u of usuarios(); track u.idUsuario) {
                  <option [value]="u.idUsuario">
                    {{ u.nombre }} {{ u.apellido }} ({{ u.email }})
                  </option>
                }
              </select>
            </div>

            <!-- Selección de Ítem -->
            <div class="col-md-6">
              <label class="form-label fw-bold">2. Seleccionar Ítem Disponible</label>
              <select
                class="form-select"
                formControlName="idItem"
                [disabled]="!selectedUserId()">
                <option [ngValue]="null" disabled>-- Selecciona un ítem --</option>
                @for (item of items(); track item.idItem) {
                  <option [value]="item.idItem">
                    [{{ item.codigo }}] {{ item.nombre }} - \${{ item.precio }}
                  </option>
                }
              </select>
            </div>

            <!-- Observaciones -->
            <div class="col-12">
              <label class="form-label fw-bold">3. Observaciones (Opcional)</label>
              <input
                type="text"
                class="form-control"
                formControlName="observacion"
                placeholder="Ej: Entregado para trabajo remoto, estado impecable." />
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <app-button
              type="submit"
              variant="primary"
              [loading]="isSaving()"
              [disabled]="asignacionForm.invalid || !selectedUserId()">
              <i class="bi bi-check-circle me-1"></i> Asignar Ítem
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AsignacionFormCardComponent {
  private fb = inject(FormBuilder);

  usuarios = input<Usuario[]>([]);
  items = input<Item[]>([]);
  isSaving = input<boolean>(false);
  selectedUserId = input<number | null>(null);

  onUsuarioSelected = output<number>();
  onAssign = output<CreateAsignacionRequest>();

  asignacionForm = this.fb.group({
    idUsuario: [null as number | null, [Validators.required]],
    idItem: [null as number | null, [Validators.required]],
    observacion: ['']
  });

  constructor() {
    effect(() => {
      const uid = this.selectedUserId();
      if (uid && this.asignacionForm.controls.idUsuario.value !== uid) {
        this.asignacionForm.controls.idUsuario.setValue(uid, { emitEvent: false });
      }
    });
  }

  onUserChange(): void {
    const uid = this.asignacionForm.controls.idUsuario.value;
    if (uid) {
      this.onUsuarioSelected.emit(Number(uid));
      this.asignacionForm.controls.idItem.reset();
    }
  }

  handleSubmit(): void {
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    const payload: CreateAsignacionRequest = {
      idUsuario: Number(this.asignacionForm.controls.idUsuario.value),
      idItem: Number(this.asignacionForm.controls.idItem.value),
      observacion: this.asignacionForm.controls.observacion.value || ''
    };

    this.onAssign.emit(payload);
    this.asignacionForm.controls.idItem.reset();
    this.asignacionForm.controls.observacion.reset();
  }
}
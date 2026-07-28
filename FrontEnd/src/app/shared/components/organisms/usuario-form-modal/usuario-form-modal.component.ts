import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../../../core/models/usuario.models';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'app-usuario-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    FormFieldComponent
  ],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal d-block fade show" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content shadow-lg border-0">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title fw-bold">
                {{ usuarioToEdit() ? 'Editar Usuario' : 'Nuevo Usuario' }}
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                (click)="onClose.emit()"></button>
            </div>

            <form [formGroup]="userForm" (ngSubmit)="handleSubmit()">
              <div class="modal-body p-4">
                <div class="row">
                  <div class="col-md-6">
                    <app-form-field
                      label="Nombre"
                      [errorMessage]="getFieldError('nombre')"
                      [isTouched]="userForm.controls.nombre.touched">
                      <app-input
                        formControlName="nombre"
                        placeholder="Ej: Juan"
                        [hasError]="userForm.controls.nombre.invalid && userForm.controls.nombre.touched">
                      </app-input>
                    </app-form-field>
                  </div>
                  <div class="col-md-6">
                    <app-form-field
                      label="Apellido"
                      [errorMessage]="getFieldError('apellido')"
                      [isTouched]="userForm.controls.apellido.touched">
                      <app-input
                        formControlName="apellido"
                        placeholder="Ej: Pérez"
                        [hasError]="userForm.controls.apellido.invalid && userForm.controls.apellido.touched">
                      </app-input>
                    </app-form-field>
                  </div>
                </div>

                <app-form-field
                  label="Correo Electrónico"
                  [errorMessage]="getFieldError('email')"
                  [isTouched]="userForm.controls.email.touched">
                  <app-input
                    type="email"
                    formControlName="email"
                    placeholder="juan.perez@dominio.com"
                    [hasError]="userForm.controls.email.invalid && userForm.controls.email.touched">
                  </app-input>
                </app-form-field>

                @if (!usuarioToEdit()) {
                  <app-form-field
                    label="Contraseña"
                    [errorMessage]="getFieldError('password')"
                    [isTouched]="userForm.controls.password.touched">
                    <app-input
                      type="password"
                      formControlName="password"
                      placeholder="••••••••"
                      [hasError]="userForm.controls.password.invalid && userForm.controls.password.touched">
                    </app-input>
                  </app-form-field>
                }

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Rol</label>
                    <select class="form-select" formControlName="rol">
                      <option value="Usuario">Usuario</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  @if (usuarioToEdit()) {
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-bold">Estado</label>
                      <div class="form-check form-switch mt-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="estadoSwitch"
                          formControlName="estado" />
                        <label class="form-check-label fw-medium" for="estadoSwitch">
                          {{ userForm.controls.estado.value ? 'Activo' : 'Inactivo' }}
                        </label>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="modal-footer bg-light px-4 py-3">
                <app-button type="button" variant="secondary" (onClick)="onClose.emit()">
                  Cancelar
                </app-button>
                <app-button
                  type="submit"
                  variant="primary"
                  [loading]="isSaving()"
                  [disabled]="userForm.invalid">
                  Guardar
                </app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class UsuarioFormModalComponent {
  private fb = inject(FormBuilder);

  isOpen = input<boolean>(false);
  isSaving = input<boolean>(false);
  usuarioToEdit = input<Usuario | null>(null);

  onClose = output<void>();
  onSave = output<CreateUsuarioRequest | UpdateUsuarioRequest>();

  userForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['Usuario', [Validators.required]],
    estado: [true]
  });

  constructor() {
    effect(() => {
      const user = this.usuarioToEdit();
      if (user) {
        this.userForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol,
          estado: user.estado
        });
        this.userForm.controls.password.clearValidators();
      } else {
        this.userForm.reset({ rol: 'Usuario', estado: true });
        this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      }
      this.userForm.controls.password.updateValueAndValidity();
    });
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.value;

    if (this.usuarioToEdit()) {
      const updatePayload: UpdateUsuarioRequest = {
        idUsuario: this.usuarioToEdit()!.idUsuario,
        nombre: formValues.nombre!,
        apellido: formValues.apellido!,
        email: formValues.email!,
        rol: formValues.rol!,
        estado: formValues.estado!
      };
      this.onSave.emit(updatePayload);
    } else {
      const createPayload: CreateUsuarioRequest = {
        nombre: formValues.nombre!,
        apellido: formValues.apellido!,
        email: formValues.email!,
        password: formValues.password!,
        rol: formValues.rol!
      };
      this.onSave.emit(createPayload);
    }
  }

  getFieldError(fieldName: string): string | null {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.hasError('email')) return 'Ingresa un correo electrónico válido.';
    if (control?.hasError('minlength')) return 'Debe tener más caracteres.';
    return null;
  }
}
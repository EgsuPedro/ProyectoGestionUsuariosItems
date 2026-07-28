import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item, CreateItemRequest, UpdateItemRequest } from '../../../../../core/models/item.models';
import { ButtonComponent } from '../../../atoms/button/button.component';
import { InputComponent } from '../../../atoms/input/input.component';
import { FormFieldComponent } from '../../../molecules/form-field/form-field.component';

@Component({
  selector: 'app-item-form-modal',
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
                {{ itemToEdit() ? 'Editar Ítem' : 'Nuevo Ítem' }}
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                (click)="onClose.emit()"></button>
            </div>

            <form [formGroup]="itemForm" (ngSubmit)="handleSubmit()">
              <div class="modal-body p-4">
                <div class="row">
                  <div class="col-md-6">
                    <app-form-field
                      label="Código"
                      [errorMessage]="getFieldError('codigo')"
                      [isTouched]="itemForm.controls.codigo.touched">
                      <app-input
                        formControlName="codigo"
                        placeholder="Ej: ITM-001"
                        [hasError]="itemForm.controls.codigo.invalid && itemForm.controls.codigo.touched">
                      </app-input>
                    </app-form-field>
                  </div>
                  <div class="col-md-6">
                    <app-form-field
                      label="Precio ($ USD)"
                      [errorMessage]="getFieldError('precio')"
                      [isTouched]="itemForm.controls.precio.touched">
                      <app-input
                        type="number"
                        formControlName="precio"
                        placeholder="0.00"
                        [hasError]="itemForm.controls.precio.invalid && itemForm.controls.precio.touched">
                      </app-input>
                    </app-form-field>
                  </div>
                </div>

                <app-form-field
                  label="Nombre del Ítem"
                  [errorMessage]="getFieldError('nombre')"
                  [isTouched]="itemForm.controls.nombre.touched">
                  <app-input
                    formControlName="nombre"
                    placeholder="Ej: Laptop Dell XPS 15"
                    [hasError]="itemForm.controls.nombre.invalid && itemForm.controls.nombre.touched">
                  </app-input>
                </app-form-field>

                <div class="mb-3">
                  <label class="form-label fw-bold">Descripción</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    formControlName="descripcion"
                    placeholder="Detalles opcionales del ítem..."></textarea>
                </div>

                @if (itemToEdit()) {
                  <div class="mb-3">
                    <label class="form-label fw-bold">Estado</label>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="itemEstadoSwitch"
                        formControlName="estado" />
                      <label class="form-check-label fw-medium" for="itemEstadoSwitch">
                        {{ itemForm.controls.estado.value ? 'Disponible' : 'Inactivo' }}
                      </label>
                    </div>
                  </div>
                }
              </div>

              <div class="modal-footer bg-light px-4 py-3">
                <app-button type="button" variant="secondary" (onClick)="onClose.emit()">
                  Cancelar
                </app-button>
                <app-button
                  type="submit"
                  variant="primary"
                  [loading]="isSaving()"
                  [disabled]="itemForm.invalid">
                  Guardar Ítem
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
export class ItemFormModalComponent {
  private fb = inject(FormBuilder);

  isOpen = input<boolean>(false);
  isSaving = input<boolean>(false);
  itemToEdit = input<Item | null>(null);

  onClose = output<void>();
  onSave = output<CreateItemRequest | UpdateItemRequest>();

  itemForm = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    estado: [true]
  });

  constructor() {
    effect(() => {
      const item = this.itemToEdit();
      if (item) {
        this.itemForm.patchValue({
          codigo: item.codigo,
          nombre: item.nombre,
          descripcion: item.descripcion || '',
          precio: item.precio,
          estado: item.estado
        });
      } else {
        this.itemForm.reset({ precio: 0, estado: true });
      }
    });
  }

  handleSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const values = this.itemForm.value;

    if (this.itemToEdit()) {
      const updatePayload: UpdateItemRequest = {
        idItem: this.itemToEdit()!.idItem,
        codigo: values.codigo!,
        nombre: values.nombre!,
        descripcion: values.descripcion || '',
        precio: values.precio!,
        estado: values.estado!
      };
      this.onSave.emit(updatePayload);
    } else {
      const createPayload: CreateItemRequest = {
        codigo: values.codigo!,
        nombre: values.nombre!,
        descripcion: values.descripcion || '',
        precio: values.precio!
      };
      this.onSave.emit(createPayload);
    }
  }

  getFieldError(fieldName: string): string | null {
    const control = this.itemForm.get(fieldName);
    if (control?.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.hasError('minlength')) return 'Código demasiado corto.';
    if (control?.hasError('min')) return 'El precio no puede ser negativo.';
    return null;
  }
}
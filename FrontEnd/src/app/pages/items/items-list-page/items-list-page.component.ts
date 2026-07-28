import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../../core/services/items.service';
import { Item, CreateItemRequest, UpdateItemRequest } from '../../../core/models/item.models';
import { ItemsTableComponent } from '../../../shared/components/organisms/items-table/items-table/items-table.component';
import { ItemFormModalComponent } from '../../../shared/components/organisms/items-table/item-form-modal/item-form-modal.component';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { SpinnerComponent } from '../../../shared/components/atoms/spinner/spinner.component';
import { AlertComponent } from '../../../shared/components/molecules/alert/alert.component';

@Component({
  selector: 'app-items-list-page',
 // standalone: true,
  imports: [
    FormsModule,
    ItemsTableComponent,
    ItemFormModalComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent
  ],
  template: `
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h2 class="fw-bold text-dark m-0">Catálogo de Ítems</h2>
        <p class="text-muted small m-0">Gestiona los productos y recursos disponibles en el sistema</p>
      </div>
      <app-button type="button" variant="primary" (onClick)="openCreateModal()">
        <i class="bi bi-plus-circle me-1"></i> Nuevo Ítem
      </app-button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="card border-0 shadow-sm p-3 mb-4 bg-white">
      <div class="input-group">
        <span class="input-group-text bg-light border-end-0">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          class="form-control bg-light border-start-0"
          placeholder="Buscar por código, nombre o descripción..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)" />
      </div>
    </div>

    <app-alert [message]="alertMessage()" [type]="alertType()"></app-alert>

    @if (isLoading()) {
      <div class="d-flex justify-content-center py-5">
        <app-spinner message="Cargando catálogo de ítems..."></app-spinner>
      </div>
    } @else {
      <app-items-table
        [items]="filteredItems()"
        (onEdit)="openEditModal($event)"
        (onDelete)="handleDelete($event)">
      </app-items-table>
    }

    <app-item-form-modal
      [isOpen]="isModalOpen()"
      [isSaving]="isSaving()"
      [itemToEdit]="selectedItem()"
      (onClose)="closeModal()"
      (onSave)="handleSave($event)">
    </app-item-form-modal>
  `
})
export class ItemsListPageComponent implements OnInit {
  private itemsService = inject(ItemsService);

  // Signals de estado
  items = signal<Item[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  selectedItem = signal<Item | null>(null);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'danger'>('success');

  // Signal computada para filtrado instantáneo
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.items();

    return this.items().filter(item =>
      item.nombre.toLowerCase().includes(term) ||
      item.codigo.toLowerCase().includes(term) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.itemsService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.showAlert('Error al conectar con el microservicio de Ítems', 'danger');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.selectedItem.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(item: Item): void {
    this.selectedItem.set(item);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedItem.set(null);
  }

  handleSave(payload: CreateItemRequest | UpdateItemRequest): void {
    this.isSaving.set(true);

    if ('idItem' in payload) {
      // Edición
      this.itemsService.update(payload.idItem, payload as UpdateItemRequest).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.showAlert('Ítem actualizado exitosamente', 'success');
          this.loadItems();
        },
        error: () => {
          this.isSaving.set(false);
          this.showAlert('No se pudo actualizar el ítem', 'danger');
        }
      });
    } else {
      // Creación
      this.itemsService.create(payload as CreateItemRequest).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.showAlert('Ítem guardado correctamente', 'success');
          this.loadItems();
        },
        error: () => {
          this.isSaving.set(false);
          this.showAlert('Error al registrar el nuevo ítem', 'danger');
        }
      });
    }
  }

  handleDelete(idItem: number): void {
    if (confirm('¿Está seguro de que desea eliminar este ítem?')) {
      this.itemsService.delete(idItem).subscribe({
        next: () => {
          this.showAlert('Ítem eliminado correctamente', 'success');
          this.loadItems();
        },
        error: () => {
          this.showAlert('No se pudo eliminar el ítem seleccionado', 'danger');
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
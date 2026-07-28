import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (message()) {
      <div [class]="'alert alert-' + type() + ' alert-dismissible fade show'" role="alert">
        {{ message() }}
      </div>
    }
  `
})
export class AlertComponent {
  message = input<string | null>(null);
  type = input<'danger' | 'success' | 'warning' | 'info'>('danger');
}
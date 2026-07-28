import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="'btn btn-' + variant() + (fullWidth() ? ' w-100' : '')"
      (click)="onClick.emit($event)">
      @if (loading()) {
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.6rem 1.2rem;
      font-weight: 500;
      border-radius: 0.375rem;
      transition: all 0.2s ease-in-out;
    }
  `]
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'success' | 'danger' | 'outline-primary'>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);

  onClick = output<MouseEvent>();
}
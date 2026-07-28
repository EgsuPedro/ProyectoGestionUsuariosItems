import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="'badge bg-' + colorClass">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
      border-radius: 0.25rem;
    }
  `]
})
export class BadgeComponent {
  status = input<boolean | string>(true);

  get colorClass(): string {
    const val = this.status();
    if (typeof val === 'boolean') {
      return val ? 'success' : 'danger';
    }
    if (val === 'Admin') return 'primary';
    if (val === 'Usuario') return 'info';
    return 'secondary';
  }
}
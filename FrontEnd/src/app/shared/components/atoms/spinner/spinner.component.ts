import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if (show()) {
      <div [class]="fullscreen() ? 'spinner-overlay' : 'd-inline-flex align-items-center gap-2'">
        <div [class]="'spinner-border text-' + color() + ' ' + sizeClass" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        @if (message()) {
          <span [class]="'text-' + color() + ' fw-medium small'">{{ message() }}</span>
        }
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class SpinnerComponent {
  show = input<boolean>(true);
  message = input<string | null>(null);
  color = input<'primary' | 'secondary' | 'light' | 'dark'>('primary');
  fullscreen = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  get sizeClass(): string {
    return this.size() === 'sm' ? 'spinner-border-sm' : '';
  }
}
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="mb-3" align-items-center>
      @if (label()) {
        <label class="form-label fw-bold">{{ label() }}</label>
      }
      <ng-content></ng-content>
      @if (errorMessage() && isTouched()) {
        <div class="text-danger mt-1 small">
          {{ errorMessage() }}
        </div>
      }
    </div>
  `
})
export class FormFieldComponent {
  label = input<string>('');
  errorMessage = input<string | null>(null);
  isTouched = input<boolean>(false);
}
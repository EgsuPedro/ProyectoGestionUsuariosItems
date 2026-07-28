import { Component } from '@angular/core';
import { LoginFormComponent } from '../../../shared/components/organisms/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <div class="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <app-login-form></app-login-form>
    </div>
  `,
  styles: [`
    .login-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `]
})
export class LoginPageComponent {}
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { AlertComponent } from '../../molecules/alert/alert.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    FormFieldComponent,
    AlertComponent
  ],
  template: `
    <div class="card shadow-sm border-0 p-4 align-items-center">
      <div class="text-center mb-4" align-items-center>
        <h3 class="fw-bold text-primary">Iniciar Sesión</h3>
        <p class="text-muted small">Ingresa tus credenciales para acceder al sistema</p>
      </div>

      <app-alert [message]="errorMessage()" type="danger"></app-alert>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <app-form-field
          label="Correo Electrónico"
          [errorMessage]="getEmailErrorMessage()"
          [isTouched]="loginForm.controls.email.touched">
          <app-input
            type="email"
            placeholder="ejemplo@dominio.com"
            formControlName="email"
            [hasError]="loginForm.controls.email.invalid && loginForm.controls.email.touched">
          </app-input>
        </app-form-field>

        <app-form-field
          label="Contraseña"
          [errorMessage]="getPasswordErrorMessage()"
          [isTouched]="loginForm.controls.password.touched">
          <app-input
            type="password"
            placeholder="••••••••"
            formControlName="password"
            [hasError]="loginForm.controls.password.invalid && loginForm.controls.password.touched">
          </app-input>
        </app-form-field>

        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          [loading]="isLoading()"
          >
          Ingresar
        </app-button>
      </form>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 0.75rem;
      max-width: 420px;
      width: 100%;
    }
  `]
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = {
      email: this.loginForm.controls.email.value!,
      password: this.loginForm.controls.password.value!
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/usuarios']); // Redirige a la pantalla principal de administración
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Credenciales incorrectas o usuario inactivo.');
        } else {
          this.errorMessage.set('Error de conexión con el servidor de autenticación.');
        }
      }
    });
  }

  getEmailErrorMessage(): string | null {
    const control = this.loginForm.controls.email;
    if (control.hasError('required')) return 'El correo electrónico es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido.';
    return null;
  }

  getPasswordErrorMessage(): string | null {
    const control = this.loginForm.controls.password;
    if (control.hasError('required')) return 'La contraseña es obligatoria.';
    if (control.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
  }
}
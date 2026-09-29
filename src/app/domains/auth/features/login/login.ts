import { Component, inject, signal } from '@angular/core';
import { LoginFormData, LoginSchema } from './login.schema';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { useFormValidator } from '@/app/shared/utils/form-validator';
import { FieldError } from '@/app/shared/components/field-error/field-error';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FieldError],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly loginForm = signal<LoginFormData>({ email: '', password: '' });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly formValidator = useFormValidator(LoginSchema, this.loginForm);

  updateField(field: keyof LoginFormData, value: string) {
    this.loginForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.formValidator.submitAttempted.set(true);

    if (!this.formValidator.validation().success) {
      return;
    }

    const payload = {
      email: this.loginForm().email,
      password: this.loginForm().password,
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.authService.login(payload));

      this.router.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      const detail = (error as HttpErrorResponse)?.error?.detail;
      this.errorMessage.set(detail ?? 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      this.loading.set(false);
    }
  }
}

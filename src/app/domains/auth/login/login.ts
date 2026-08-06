import { Component, computed, inject, signal } from '@angular/core';
import { LoginFormData, LoginSchema } from './login.schema';
import { safeParse } from 'valibot';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly loginForm = signal<LoginFormData>({ email: '', password: '' });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly validation = computed(() => safeParse(LoginSchema, this.loginForm()));

  updateField(field: keyof LoginFormData, value: string) {
    this.loginForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async onSubmit() {
    if (!this.validation().success) {
      this.errorMessage.set('Por favor, revisa los campos del formulario.');
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

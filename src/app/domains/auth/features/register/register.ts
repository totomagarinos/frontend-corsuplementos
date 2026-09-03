import { Component, computed, inject, signal } from '@angular/core';
import { RegisterFormData, RegisterSchema } from './register.schema';
import { safeParse } from 'valibot';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly registerForm = signal<RegisterFormData>({ email: '', password: '' });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly validation = computed(() => safeParse(RegisterSchema, this.registerForm()));

  updateField(field: keyof RegisterFormData, value: string) {
    this.registerForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.validation().success) {
      this.errorMessage.set('Por favor, revisa los campos del formulario.');
      return;
    }

    const payload = {
      email: this.registerForm().email,
      password: this.registerForm().password,
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.authService.register(payload));

      this.router.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      const err = error as HttpErrorResponse;
      const body = err.error;
      if (body && typeof body === 'object' && !body.detail) {
        const messages = Object.values(body).flat().join(' ');
        this.errorMessage.set(messages || 'No se pudo crear la cuenta.');
      } else {
        this.errorMessage.set(body?.detail ?? 'No se pudo crear la cuenta.');
      }
    } finally {
      this.loading.set(false);
    }
  }
}

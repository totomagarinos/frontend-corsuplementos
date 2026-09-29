import { Component, inject, signal } from '@angular/core';
import { RegisterFormData, RegisterSchema } from './register.schema';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { useFormValidator } from '@/app/shared/utils/form-validator';
import { FieldError } from '@/app/shared/components/field-error/field-error';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FieldError],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly registerForm = signal<RegisterFormData>({ email: '', password: '' });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly formValidator = useFormValidator(RegisterSchema, this.registerForm);

  updateField(field: keyof RegisterFormData, value: string) {
    this.registerForm.update((current) => ({
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

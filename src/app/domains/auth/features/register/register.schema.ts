import { email, InferOutput, minLength, object, pipe, string } from 'valibot';

export const RegisterSchema = object({
  email: pipe(string(), email('Email inválido')),
  password: pipe(string(), minLength(8, 'La contraseña debe tener al menos 8 caracteres.')),
});

export type RegisterFormData = InferOutput<typeof RegisterSchema>;

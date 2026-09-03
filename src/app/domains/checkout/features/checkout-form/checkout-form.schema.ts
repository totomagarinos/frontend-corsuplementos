import { email, InferOutput, minLength, object, optional, pipe, string } from 'valibot';

export const CheckoutSchema = object({
  name: pipe(string(), minLength(2, 'El nombre es muy corto')),
  email: pipe(string(), email('Email inválido')),
  phone: pipe(string(), minLength(7, 'Teléfono inválido')),
  address: optional(string()),
  department: optional(string()),
  notes: optional(string()),
});

export type CheckoutFormData = InferOutput<typeof CheckoutSchema>;

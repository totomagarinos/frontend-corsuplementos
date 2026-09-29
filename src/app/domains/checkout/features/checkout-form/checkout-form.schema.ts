import {
  boolean,
  check,
  email,
  forward,
  InferOutput,
  minLength,
  object,
  optional,
  pipe,
  string,
} from 'valibot';

export const CheckoutSchema = pipe(
  object({
    name: pipe(string(), minLength(3, 'El nombre es muy corto')),
    email: pipe(string(), email('Email inválido')),
    phone: pipe(string(), minLength(7, 'Teléfono inválido')),
    address: optional(string()),
    department: optional(string()),
    notes: optional(string()),
    requiresAddress: boolean(),
  }),

  forward(
    check((input) => {
      if (input.requiresAddress) {
        return !!input.address && input.address.trim().length > 5;
      }
      return true;
    }, 'La dirección es muy corta.'),
    ['address'],
  ),

  forward(
    check((input) => {
      if (input.requiresAddress) {
        return !!input.department;
      }
      return true;
    }, 'Selecciona un departamento.'),
    ['department'],
  ),
);

export type CheckoutFormData = Omit<InferOutput<typeof CheckoutSchema>, 'requiresAddress'>;

import { extractApiErrorMessage } from './api-error';

describe('extractApiErrorMessage', () => {
  const fallback = 'Error al crear el pedido.';

  it('returns the fallback when there is no response body', () => {
    expect(extractApiErrorMessage(new Error('network down'), fallback)).toBe(fallback);
    expect(extractApiErrorMessage(null, fallback)).toBe(fallback);
    expect(extractApiErrorMessage(undefined, fallback)).toBe(fallback);
    expect(extractApiErrorMessage({}, fallback)).toBe(fallback);
  });

  it('uses a plain string body as-is', () => {
    expect(extractApiErrorMessage({ error: 'Servicio no disponible' }, fallback)).toBe(
      'Servicio no disponible',
    );
  });

  it('reads a DRF detail message', () => {
    const error = { error: { detail: 'Authentication credentials were not provided.' } };

    expect(extractApiErrorMessage(error, fallback)).toBe(
      'Authentication credentials were not provided.',
    );
  });

  it('keeps field-scoped messages from validate_items', () => {
    const error = {
      error: { items: ['Vainilla 500g: solo quedan 2 unidad(es), solicitaste 5.'] },
    };

    expect(extractApiErrorMessage(error, fallback)).toBe(
      'Vainilla 500g: solo quedan 2 unidad(es), solicitaste 5.',
    );
  });

  it('joins several field errors in payload order', () => {
    const error = {
      error: {
        shipping_option: ['La opción de envío elegida no está disponible.'],
        payment_method: ['El pago en efectivo solo está disponible para retiro en el local.'],
      },
    };

    expect(extractApiErrorMessage(error, fallback)).toBe(
      'La opción de envío elegida no está disponible. ' +
        'El pago en efectivo solo está disponible para retiro en el local.',
    );
  });

  it('walks nested serializer errors', () => {
    const error = {
      error: { items: [{ variant: ['Invalid pk "99" - object does not exist.'] }] },
    };

    expect(extractApiErrorMessage(error, fallback)).toBe(
      'Invalid pk "99" - object does not exist.',
    );
  });

  it('ignores blank messages and falls back', () => {
    expect(extractApiErrorMessage({ error: { items: ['   '] } }, fallback)).toBe(fallback);
  });
});

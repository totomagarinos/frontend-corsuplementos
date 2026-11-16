/**
 * Turns a Django REST Framework error payload into one readable message.
 *
 * DRF replies with different shapes depending on where validation failed:
 *
 *   { "detail": "..." }                       authentication / permission errors
 *   { "items": ["...", "..."] }               field errors (validate_items)
 *   { "shipping_option": "..." }              object-level errors (validate)
 *   { "items": [{ "variant": ["..."] }] }     nested serializer errors
 *
 * Reading only `detail` hides every field-scoped message, so the customer sees
 * a generic "something went wrong" while the backend already explained exactly
 * what is wrong. Flattening the payload keeps that explanation visible.
 */
export function extractApiErrorMessage(error: unknown, fallback: string): string {
  const body = (error as { error?: unknown } | null | undefined)?.error;

  if (typeof body === 'string') {
    return body.trim() || fallback;
  }

  const messages: string[] = [];
  collectMessages(body, messages);

  return messages.length > 0 ? messages.join(' ') : fallback;
}

function collectMessages(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    const message = value.trim();

    if (message) {
      out.push(message);
    }

    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMessages(item, out);
    }

    return;
  }

  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectMessages(item, out);
    }
  }
}

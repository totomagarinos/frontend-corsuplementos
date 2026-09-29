import { computed, signal, Signal } from '@angular/core';
import { BaseSchema, flatten, safeParse } from 'valibot';

export const useFormValidator = <T>(schema: BaseSchema<any, T, any>, formSignal: Signal<T>) => {
  const submitAttempted = signal(false);

  const validation = computed(() => safeParse(schema, formSignal()));

  const fieldErrors = computed(() => {
    const res = validation();
    if (res.success) {
      return {} as Record<string, [string, ...string[]] | undefined>;
    }
    return (flatten<typeof schema>(res.issues).nested ?? {}) as Record<
      string,
      [string, ...string[]] | undefined
    >;
  });

  return {
    submitAttempted,
    validation,
    fieldErrors,
  };
};

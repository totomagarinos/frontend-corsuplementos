import { effect, Service, signal } from '@angular/core';

@Service()
export class SessionService {
  readonly sessionId = signal<string>(this.loadOrCreate());

  constructor() {
    effect(() => {
      localStorage.setItem('session_id', this.sessionId());
    });
  }

  loadOrCreate() {
    const saved = localStorage.getItem('session_id');
    if (saved) return saved;
    return crypto.randomUUID();
  }
}

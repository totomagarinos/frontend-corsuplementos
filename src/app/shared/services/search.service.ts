import { Service, signal } from '@angular/core';

@Service()
export class SearchService {
  readonly searchInput = signal<string>('');
}

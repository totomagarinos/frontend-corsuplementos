import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, merge, of, skip, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly productService = inject(ProductService);
  readonly searchInput = signal<string>('');

  readonly products = toSignal(
    merge(
      of('').pipe(switchMap((term) => this.productService.getProducts(term))),

      toObservable(this.searchInput).pipe(
        skip(1),
        debounceTime(500),
        switchMap((term) => this.productService.getProducts(term)),
      ),
    ),
    { initialValue: [] },
  );

  onSearchInput(event: Event) {
    this.searchInput.set((event.target as HTMLInputElement).value);
  }
}

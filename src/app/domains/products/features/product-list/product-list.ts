import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, of, switchMap } from 'rxjs';
import { SearchService } from '@/app/shared/services/search.service';
import { PriceDisplay } from '@/app/shared/components/price-display/price-display';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, PriceDisplay],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly searchService = inject(SearchService);

  readonly products = toSignal(
    toObservable(this.searchService.searchInput).pipe(
      switchMap((term, index) =>
        index === 0
          ? this.productService.getProducts(term)
          : of(term).pipe(
              delay(500),
              switchMap((t) => this.productService.getProducts(t)),
            ),
      ),
    ),
    { initialValue: [] },
  );
}

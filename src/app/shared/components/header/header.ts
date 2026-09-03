import { AuthService } from '@/app/domains/auth/services/auth.service';
import { CartService } from '@/app/domains/cart/services/cart.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly searchService = inject(SearchService);
  router = inject(Router);

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const term = inputElement.value;

    this.searchService.searchInput.set(term);

    if (this.router.url !== '/products') {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

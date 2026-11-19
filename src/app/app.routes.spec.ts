import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { routes } from './app.routes';
import { NotFound } from './shared/components/not-found/not-found';

describe('appRoutes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('renders the not-found page for an unknown URL', async () => {
    // Navigating for real proves two things at once: the wildcard route exists
    // and it is reachable without the auth guard swallowing the request.
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/esta-ruta-no-existe', NotFound);

    expect(component).toBeInstanceOf(NotFound);
  });
});

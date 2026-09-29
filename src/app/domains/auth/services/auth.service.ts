import { LocalKeys, LocalManagerService } from '@/app/shared/services/local-manager.service';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, AuthData, LoginResponse, TokenContainer, User } from '../models/auth';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { authAdapter } from '../adapters/auth.adapter';

@Service()
export class AuthService {
  http: HttpClient = inject(HttpClient);
  localManager = inject(LocalManagerService);
  router = inject(Router);
  baseUrl = 'http://localhost:8000/api/auth';

  private readonly accessToken = signal<string | null>(this.loadInitialToken());
  readonly isAuthenticated = computed(() => this.accessToken() !== null);
  readonly currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = this.localManager.getData<User>(LocalKeys.USER);
    if (savedUser) {
      this.currentUser.set(savedUser);

      this.refreshUserProfile();
    }
  }

  private loadInitialToken(): string | null {
    return this.localManager.getData<string>(LocalKeys.ACCESS_TOKEN);
  }

  private setTokens(access: string, refresh?: string): void {
    this.localManager.setData(LocalKeys.ACCESS_TOKEN, access);
    this.accessToken.set(access);
    if (refresh) {
      this.localManager.setData(LocalKeys.REFRESH_TOKEN, refresh);
    }
  }

  login(data: AuthData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, data).pipe(
      map(authAdapter),
      tap((auth) => {
        this.setTokens(auth.access, auth.refresh);

        this.currentUser.set(auth.user);
        this.localManager.setData(LocalKeys.USER, auth.user);
      }),
    );
  }

  register(data: AuthData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register/`, data).pipe(
      map(authAdapter),
      tap((auth) => {
        this.setTokens(auth.access, auth.refresh);

        this.currentUser.set(auth.user);
        this.localManager.setData(LocalKeys.USER, auth.user);
      }),
    );
  }

  refreshToken(): Observable<TokenContainer> {
    const refreshToken = this.localManager.getData<string>(LocalKeys.REFRESH_TOKEN);

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token.'));
    }

    return this.http
      .post<LoginResponse>(`${this.baseUrl}/refresh/`, { refresh: refreshToken })
      .pipe(
        map(authAdapter),
        tap((auth) => {
          this.setTokens(auth.access);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  logout() {
    this.localManager.removeData(LocalKeys.ACCESS_TOKEN);
    this.localManager.removeData(LocalKeys.REFRESH_TOKEN);
    this.localManager.removeData(LocalKeys.USER);

    this.currentUser.set(null);
    this.accessToken.set(null);
  }

  refreshUserProfile(): void {
    if (!this.localManager.getData(LocalKeys.ACCESS_TOKEN)) {
      return;
    }

    this.http.get<User>(`${this.baseUrl}/me/`).subscribe({
      next: (freshUser) => {
        this.currentUser.set(freshUser);
        this.localManager.setData(LocalKeys.USER, freshUser);
      },

      error: () => {},
    });
  }
}

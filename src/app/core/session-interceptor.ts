import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from './session.service';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  const cloned = req.clone({
    setHeaders: { 'X-Session-ID': sessionService.sessionId() },
  });

  return next(cloned);
};

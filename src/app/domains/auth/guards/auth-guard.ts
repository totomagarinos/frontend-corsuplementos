import { LocalKeys, LocalManagerService } from '@/app/shared/services/local-manager.service';
import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = () => {
  const localManager = inject(LocalManagerService);
  const router = inject(Router);

  const token = localManager.getData(LocalKeys.ACCESS_TOKEN);

  if (token) return true;

  router.navigate(['login'], { replaceUrl: true });
  return false;
};

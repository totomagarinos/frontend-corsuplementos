/**
 * Development defaults. `environment.production.ts` replaces this file in the
 * production build (see `fileReplacements` in angular.json), so the deployed
 * bundle never carries a localhost URL.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
};

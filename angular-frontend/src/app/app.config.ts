import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const start = Date.now();
        return next(req).pipe(
          tap({
            next: () => {
              const duration = Date.now() - start;
              console.log(`%c[API Log] ${req.method} ${req.url} - ${duration}ms`, 'color: #2ecc71');
            },
            error: (err) => {
              console.error(`%c[API Error] ${req.method} ${req.url}`, 'color: #e74c3c', err);
            }
          })
        );
      }
    ]))
  ]
};
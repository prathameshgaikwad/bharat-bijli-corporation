import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const clonedRequest = req.clone();
              return next.handle(clonedRequest);
            }),
            catchError((refreshError) => {
              // refresh token is expired
              if (refreshError.status === 401 || refreshError.status === 403) {
                this.router.navigate(['/login'], {
                  queryParams: { sessionExpired: true },
                });
              }
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}

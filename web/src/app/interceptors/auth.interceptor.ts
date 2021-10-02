import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../modules/shared/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const blacklist = [
      'auth/login',
      'auth/register',
      'auth/refresh'
    ];

    // if the requested URL does not require authentication skip the headers
    for (const url of blacklist) {
      if (request.url.includes(url)) {
        return next.handle(request);
      }
    }

    // otherwise fetch the access token
    return this.authService.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          // if no valid token was retrieved then redirect to login
          this.document.location.href = '/';
          return EMPTY;
        }

        // if a valid token was retrieved add it to the headers
        const req = request.clone({
          setHeaders: {
            Authorization: token
          }
        });

        return next.handle(req);
      })
    );
  }
}

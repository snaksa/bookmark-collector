import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokens = this.authService.getTokens();
    if (tokens) {
      if (tokens.expires > Date.now()) {
        const req = request.clone({
          setHeaders: {
            Authorization: tokens.accessToken,
          },
        });

        return next.handle(req);
      } else {
        // TODO: token has expired - try to refresh it
        console.log('refresh token request');
      }
    }
    return next.handle(request);
  }
}

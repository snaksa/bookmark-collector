import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse) => {
        if (errorResponse instanceof ErrorEvent) {
          console.log('ErrorEvent', errorResponse);
          return throwError('Could not send the request');
        } else {
          switch (errorResponse.status) {
            case 401:
              this.router.navigateByUrl('login');
              break;
          }
        }

        return throwError(errorResponse.error.error ?? 'Something went wrong');
      })
    );
  }
}

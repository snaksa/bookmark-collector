import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

interface LoginResponse {
  data: {
    tokens: {
      IdToken: string;
      RefreshToken: string;
      ExpiresIn: number;
    };
  };
}

interface RefreshResponse {
  data: {
    tokens: {
      IdToken: string;
      ExpiresIn: number;
    };
  };
}

interface RegisterResponse {
  data: {
    id: string;
  };
}

interface UserResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private localStorage: LocalStorageService) {
  }

  public getToken(): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      // get tokens from LocalStorage
      const tokensString = this.localStorage.getItem(LocalStorageKeys.TOKENS);

      // if no tokens are saved return null
      if (!tokensString) {
        observer.next(null);
        observer.complete();
        return;
      }

      // parse the tokens
      const tokens = JSON.parse(tokensString);

      // if the access token has not expired return it
      if (tokens.expires > Date.now()) {
        observer.next(tokens.accessToken);
        observer.complete();
        return;
      }

      // otherwise try to refresh it
      this.refreshToken(tokens.refreshToken).subscribe((accessToken) => {
        if (accessToken) {
          observer.next(accessToken);
          observer.complete();
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  public login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, {
        email,
        password
      })
      .pipe(
        map((response) => {
          const tokens = {
            accessToken: response.data.tokens.IdToken,
            refreshToken: response.data.tokens.RefreshToken,

            // calculate expiration date
            expires: Date.now() + response.data.tokens.ExpiresIn * 1000 //convert seconds to milliseconds and add to the current timestamp
          };

          // add tokens to localStorage
          this.localStorage.setItem(LocalStorageKeys.TOKENS, JSON.stringify(tokens));

          this.router.navigateByUrl('bookmarks/my-list');
        })
      );
  }

  public refreshToken(refreshToken: string) {

    return this.http
      .post<RefreshResponse>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        map((response) => {
          const newTokens = {
            accessToken: response.data.tokens.IdToken,
            expires: Date.now() + response.data.tokens.ExpiresIn * 1000 //convert seconds to milliseconds and add to the current timestamp
          };

          // add tokens to localStorage
          this.localStorage.setItem(LocalStorageKeys.TOKENS, JSON.stringify({ refreshToken, ...newTokens }));

          return newTokens.accessToken;
        }),
        catchError(() => {
          return of(null);
        })
      );
  }

  public register(email: string, firstName: string, lastName: string, password: string) {
    return this.http
      .post<RegisterResponse>(`${environment.apiBaseUrl}/auth/register`, {
        email,
        firstName,
        lastName,
        password
      })
      .pipe(
        map((response) => {
          this.router.navigateByUrl('login');
        })
      );
  }

  public updateUser(firstName: string, lastName: string, email: string) {
    return this.http
      .put<UserResponse>(`${environment.apiBaseUrl}/auth/me`, {
        firstName,
        lastName,
        email
      })
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  public changePassword(oldPassword: string, newPassword: string) {
    return this.http
      .put(`${environment.apiBaseUrl}/auth/me/change-password`, {
        oldPassword,
        newPassword
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public getCurrentUser() {
    return this.http.get<UserResponse>(`${environment.apiBaseUrl}/auth/me`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public logout() {
    this.localStorage.removeItem(LocalStorageKeys.TOKENS);
    this.router.navigateByUrl('/');
  }
}

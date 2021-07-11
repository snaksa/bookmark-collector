import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

interface LoginResponse {
  data: {
    tokens: {
      IdToken: string;
      RefreshToken: string;
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
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private localStorage: LocalStorageService) {}

  public getTokens(): {
    accessToken: string;
    refreshToken: string;
    expires: number;
  } | null {
    const tokens = this.localStorage.getItem(LocalStorageKeys.TOKENS);
    return tokens ? JSON.parse(tokens) : null;
  }

  public login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          const tokens = {
            accessToken: response.data.tokens.IdToken,
            refreshToken: response.data.tokens.RefreshToken,

            // calculate expiration date
            expires: Date.now() + response.data.tokens.ExpiresIn * 1000, //convert seconds to milliseconds and add to the current timestamp
          };

          // add tokens to localStorage
          this.localStorage.setItem(LocalStorageKeys.TOKENS, JSON.stringify(tokens));

          this.router.navigateByUrl('bookmarks/my-list');
        })
      );
  }

  public register(email: string, firstName: string, lastName: string, password: string) {
    return this.http
      .post<RegisterResponse>(`${environment.apiBaseUrl}/auth/register`, {
        email,
        firstName,
        lastName,
        password,
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
        email,
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
        newPassword,
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
}

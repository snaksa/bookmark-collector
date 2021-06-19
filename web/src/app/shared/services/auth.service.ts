import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

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
          this.localStorage.setItem(
            LocalStorageKeys.TOKENS,
            JSON.stringify(tokens)
          );

          this.router.navigateByUrl('bookmarks/my-list');
        })
      );
  }
}

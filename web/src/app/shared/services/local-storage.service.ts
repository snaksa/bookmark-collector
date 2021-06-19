import { Injectable } from '@angular/core';

export enum LocalStorageKeys {
  TOKENS = 'tokens',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getItem(key: LocalStorageKeys): string | null {
    return localStorage.getItem(key);
  }

  public setItem(key: LocalStorageKeys, value: string): void {
    localStorage.setItem(key, value);
  }

  public removeItem(key: LocalStorageKeys): void {
    localStorage.removeItem(key);
  }
}

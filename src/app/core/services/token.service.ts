import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserLoginResponseDto } from '@features/users/models/user-api.models';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = environment.tokenStorageKey;
  private readonly USER_SESSION_KEY = 'rotinik_auth_user';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_SESSION_KEY);
  }

  saveSession(session: UserLoginResponseDto): void {
    this.setToken(session.token);
    localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(session));
  }

  getSession(): UserLoginResponseDto | null {
    const rawSession = localStorage.getItem(this.USER_SESSION_KEY);
    if (!rawSession) return null;

    try {
      return JSON.parse(rawSession) as UserLoginResponseDto;
    } catch {
      this.clearStorage();
      return null;
    }
  }
}

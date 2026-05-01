import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, map, tap, timer } from 'rxjs';
import {
  UserLoginDto,
  UserLoginResponseDto,
  UserRegistrationDto,
  UserRegisterResponseDto,
} from '../models/api/user-api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersUrl = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  register(payload: UserRegistrationDto): Observable<UserRegisterResponseDto> {
    console.log('[AuthService] Enviando Payload:', payload);
    return this.http.post<UserRegisterResponseDto>(this.usersUrl, payload);
  }

  login(payload: UserLoginDto): Observable<UserLoginResponseDto> {
    console.log('[AuthService] Enviando Payload:', payload);
    return this.http.post<Record<string, unknown>>(`${this.usersUrl}/login`, payload).pipe(
      map((session) => this.normalizeSession(session)),
      tap((session) => this.saveSession(session)),
    );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenStorageKey);
    localStorage.removeItem('rotinik_auth_user');
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenStorageKey);
  }

  getCurrentSession(): UserLoginResponseDto | null {
    const rawSession = localStorage.getItem('rotinik_auth_user');

    if (!rawSession) return null;

    try {
      return JSON.parse(rawSession) as UserLoginResponseDto;
    } catch {
      this.logout();
      return null;
    }
  }

  recuperarSenha(email: string): Observable<void> {
    console.log(`[AuthService] Recuperacao de senha solicitada para: ${email}`);
    return timer(1200).pipe(map(() => void 0));
  }

  private saveSession(session: UserLoginResponseDto): void {
    localStorage.setItem(environment.tokenStorageKey, session.token);
    localStorage.setItem('rotinik_auth_user', JSON.stringify(session));
  }

  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return Boolean(this.getToken() && session?.user?.Id);
  }

  private normalizeSession(session: Record<string, unknown>): UserLoginResponseDto {
    const rawUser = this.getUserFromSession(session);

    return {
      token: String(session['token'] ?? session['Token'] ?? ''),
      user: {
        Id: String(rawUser['Id'] ?? rawUser['id'] ?? rawUser['UserId'] ?? rawUser['userId'] ?? ''),
        Nome: String(rawUser['Nome'] ?? rawUser['nome'] ?? ''),
        Email: String(rawUser['Email'] ?? rawUser['email'] ?? ''),
      },
      message: String(session['message'] ?? session['Message'] ?? ''),
    };
  }

  private getUserFromSession(session: Record<string, unknown>): Record<string, unknown> {
    const user = session['user'] ?? session['User'];

    if (user && typeof user === 'object') {
      return user as Record<string, unknown>;
    }

    return session;
  }
}

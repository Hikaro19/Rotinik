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
  private readonly baseUrl = `${environment.apiUrl}/User`;

  constructor(private readonly http: HttpClient) {}

  register(payload: UserRegistrationDto): Observable<UserRegisterResponseDto> {
    return this.http.post<UserRegisterResponseDto>(`${this.baseUrl}/register`, payload);
  }

  login(payload: UserLoginDto): Observable<UserLoginResponseDto> {
    return this.http
      .post<UserLoginResponseDto>(`${this.baseUrl}/login`, payload)
      .pipe(tap((session) => this.saveSession(session)));
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

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as UserLoginResponseDto;
    } catch {
      this.logout();
      return null;
    }
  }

  getCurrentUserId(): string | number | null {
    return this.getCurrentSession()?.userId ?? null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getCurrentUserId());
  }

  recuperarSenha(email: string): Observable<void> {
    console.log(`[AuthService] Recuperacao de senha solicitada para: ${email}`);
    return timer(1200).pipe(map(() => void 0));
  }

  private saveSession(session: UserLoginResponseDto): void {
    localStorage.setItem(environment.tokenStorageKey, session.token);
    localStorage.setItem('rotinik_auth_user', JSON.stringify(session));
  }
}

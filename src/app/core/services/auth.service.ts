import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, map, tap, timer, switchMap } from 'rxjs';
import {
  UserLoginDto,
  UserLoginResponseDto,
  UserRegistrationDto,
  UserRegisterResponseDto,
  UserMeDto,
} from '../models/api/user-api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/User`;

  constructor(private readonly http: HttpClient) {}

  register(payload: UserRegistrationDto): Observable<UserRegisterResponseDto> {
    console.log('[Rotinik Debug] Enviando:', payload);
    return this.http.post<UserRegisterResponseDto>(this.baseUrl, payload);
  }

  login(payload: UserLoginDto): Observable<UserLoginResponseDto> {
    console.log('[Rotinik Debug] Enviando:', payload);
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        // Armazena o token para o auth.interceptor poder incluí-lo na chamada /me
        localStorage.setItem(environment.tokenStorageKey, res.token);
      }),
      switchMap((res) => {
        return this.http.get<UserMeDto>(`${this.baseUrl}/me`).pipe(
          map((user) => ({
            token: res.token,
            user: user,
            message: 'Login realizado com sucesso',
          }))
        );
      }),
      tap((session) => this.saveSession(session))
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
    return Boolean(this.getToken() && session?.user?.email);
  }
}

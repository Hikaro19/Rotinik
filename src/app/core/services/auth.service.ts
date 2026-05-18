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
  // Separamos as rotas para refletir os Controllers do C#
  private readonly userUrl = `${environment.apiUrl}/user`;
  private readonly authUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) { }

  register(payload: UserRegistrationDto): Observable<UserRegisterResponseDto> {
    console.log('[Rotinik Debug] Registrando:', payload);
    // Usa o UserController
    return this.http.post<UserRegisterResponseDto>(this.userUrl, payload);
  }

  login(payload: UserLoginDto): Observable<UserLoginResponseDto> {
    console.log('[Rotinik Debug] Fazendo Login:', payload);

    // Chama o AuthController para pegar o Token
    return this.http.post<{ token: string, message: string }>(`${this.authUrl}/login`, payload).pipe(
      tap((res) => {
        // Armazena o token ANTES do switchMap para o Interceptor pegar
        localStorage.setItem(environment.tokenStorageKey, res.token);
      }),
      switchMap((res) => {
        // Agora com o token salvo, chama o UserController para pegar os dados
        return this.http.get<UserMeDto>(`${this.userUrl}/me`).pipe(
          map((user) => ({
            token: res.token,
            user: user,
            message: res.message || 'Login realizado com sucesso',
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
    // Mantido o mock por enquanto, até criarmos a rota real no C#
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
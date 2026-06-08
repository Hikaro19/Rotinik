import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, map, tap, timer, switchMap, of } from 'rxjs';
import { TokenService } from './token.service';
import {
  UserLoginDto,
  UserLoginResponseDto,
  UserRegistrationDto,
  UserRegisterResponseDto,
  UserMeDto,
} from '@features/users/models/user-api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  register(payload: UserRegistrationDto): Observable<UserRegisterResponseDto> {
    return this.http.post<UserRegisterResponseDto>(this.apiUrl, payload);
  }

  login(payload: UserLoginDto): Observable<UserLoginResponseDto> {
    return this.http
      .post<{ data: { accessToken: string; refreshToken: string }; message: string }>(
        `${this.apiUrl}/login`,
        payload,
      )
      .pipe(
        tap((res) => this.tokenService.setToken(res.data.accessToken)),
        switchMap((res) =>
          this.http.get<UserMeDto>(`${this.apiUrl}/me`).pipe(
            map((user) => ({
              token: res.data.accessToken,
              user: user,
              message: res.message || 'Login realizado com sucesso',
            })),
          ),
        ),
        tap((session) => this.tokenService.saveSession(session)),
      );
  }

  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    const session = this.tokenService.getSession();
    return Boolean(this.tokenService.getToken() && session?.user?.email);
  }

  isAdmin(): boolean {
    const session = this.getCurrentSession();
    if (!session || !session.user) {
      return false;
    }
    const user = session.user;
    if (user.isAdmin !== undefined) {
      return Boolean(user.isAdmin);
    }
    return user.role === 'admin';
  }

  getCurrentSession(): UserLoginResponseDto | null {
    return this.tokenService.getSession();
  }

  fetchCurrentUser(): Observable<UserMeDto> {
    return this.http.get<UserMeDto>(`${this.apiUrl}/me`);
  }

  updateSessionUser(user: UserMeDto): void {
    const session = this.tokenService.getSession();
    if (session) {
      session.user = user;
      this.tokenService.saveSession(session);
    }
  }

  recuperarSenha(_email: string): Observable<void> {
    return timer(1200).pipe(map(() => void 0));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ProfileSnapshotDto } from '@core/models/api';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);

  // CORREÇÃO: Aponta para a rota [Route("api/[controller]")] do seu UserController do C#
  private readonly baseUrl = `${environment.apiBaseUrl}/User`;

  /**
   * Obtém o snapshot do perfil do usuário autenticado.
   * Alinhado com o endpoint [HttpGet("me")] do back-end em C#.
   */
  getSnapshot(): Observable<ProfileSnapshotDto> {
    // Alvo final: http://localhost:5025/api/User/me
    return this.http.get<ProfileSnapshotDto>(`${this.baseUrl}/me`);
  }
}

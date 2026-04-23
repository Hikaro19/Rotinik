import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ProfileSnapshotDto } from '@core/models/api';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/${environment.apiVersion}/profile`;

  getSnapshot(): Observable<ProfileSnapshotDto> {
    return this.http.get<ProfileSnapshotDto>(this.baseUrl);
  }
}

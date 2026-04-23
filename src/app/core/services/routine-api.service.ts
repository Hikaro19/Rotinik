import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  CompleteTaskResponseDto,
  CreateRoutineRequestDto,
  CreateTaskRequestDto,
  RoutineDto,
  RoutinesSnapshotDto,
  UpdateRoutineRequestDto,
} from '@core/models/api';

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/${environment.apiVersion}/routines`;

  getSnapshot(): Observable<RoutinesSnapshotDto> {
    return this.http.get<RoutinesSnapshotDto>(this.baseUrl);
  }

  getById(routineId: string): Observable<RoutineDto> {
    return this.http.get<RoutineDto>(`${this.baseUrl}/${routineId}`);
  }

  create(payload: CreateRoutineRequestDto): Observable<RoutineDto> {
    return this.http.post<RoutineDto>(this.baseUrl, payload);
  }

  update(routineId: string, payload: UpdateRoutineRequestDto): Observable<RoutineDto> {
    return this.http.put<RoutineDto>(`${this.baseUrl}/${routineId}`, payload);
  }

  delete(routineId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${routineId}`);
  }

  addTask(routineId: string, payload: CreateTaskRequestDto): Observable<RoutineDto> {
    return this.http.post<RoutineDto>(`${this.baseUrl}/${routineId}/tasks`, payload);
  }

  deleteTask(routineId: string, taskId: string): Observable<RoutineDto> {
    return this.http.delete<RoutineDto>(`${this.baseUrl}/${routineId}/tasks/${taskId}`);
  }

  completeTask(routineId: string, taskId: string): Observable<CompleteTaskResponseDto> {
    return this.http.post<CompleteTaskResponseDto>(`${this.baseUrl}/${routineId}/tasks/${taskId}/complete`, {});
  }
}

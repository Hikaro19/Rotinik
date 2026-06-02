import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  CompleteTaskResponseDto,
  CreateRoutineRequestDto,
  CreateTaskRequestDto,
  RoutineDto,
  RoutineSummaryResponse,
  RoutinesSnapshotDto,
  UpdateRoutineRequestDto,
  UpdateTaskRequestDto,
} from '../models/routine-api.models';

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private readonly http = inject(HttpClient);
  // BaseUrl aponta para api/Routine seguindo o padrão de nomenclatura do C# Controller
  private readonly baseUrl = `${environment.apiBaseUrl}/routine`;

  /**
   * Obtém o snapshot completo (usuário + rotinas).
   */
  getSnapshot(): Observable<RoutinesSnapshotDto> {
    return this.http.get<RoutinesSnapshotDto>(this.baseUrl);
  }

  getAll(): Observable<RoutineDto[]> {
    return this.getSnapshot().pipe(
      map(res => res.routines)
    );
  }

  getById(routineId: string | number): Observable<RoutineDto> {
    return this.http.get<RoutineDto>(`${this.baseUrl}/${routineId}`);
  }

  create(payload: CreateRoutineRequestDto): Observable<RoutineDto> {
    return this.http.post<RoutineDto>(this.baseUrl, payload);
  }

  update(routineId: string | number, payload: UpdateRoutineRequestDto): Observable<RoutineDto> {
    return this.http.put<RoutineDto>(`${this.baseUrl}/${routineId}`, payload);
  }

  delete(routineId: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${routineId}`);
  }

  getTemplates(): Observable<RoutineSummaryResponse[]> {
    return this.http.get<RoutineSummaryResponse[]>(`${this.baseUrl}/templates`);
  }

  cloneTemplate(templateId: string | number): Observable<RoutineDto> {
    return this.http.post<RoutineDto>(`${this.baseUrl}/templates/${templateId}/clone`, {});
  }

  addTask(routineId: string, payload: CreateTaskRequestDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${routineId}/task`, payload);
  }

  updateTask(
    routineId: string,
    taskId: string,
    payload: UpdateTaskRequestDto
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${routineId}/task/${taskId}`, payload);
  }

  deleteTask(routineId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${routineId}/task/${taskId}`);
  }

  completeTask(routineId: string, taskId: string): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/${routineId}/task/${taskId}/toggle`,
      {}
    );
  }
}

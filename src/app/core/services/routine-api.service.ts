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
  UpdateRoutineRequestDto,
} from '@core/models/api';

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private readonly http = inject(HttpClient);
  // BaseUrl aponta para api/Routine seguindo o padrão de nomenclatura do C# Controller
  private readonly baseUrl = `${environment.apiBaseUrl}/Routine`;

  /**
   * Obtém todas as rotinas resumidas e busca os detalhes de cada uma em paralelo.
   * Blindado com catchError para evitar que falhas individuais zerem a listagem completa.
   */
  getSnapshot(): Observable<RoutineDto[]> {
    return this.getAll().pipe(
      switchMap((summaries) => {
        if (!summaries || summaries.length === 0) {
          return of([]);
        }

        const detailRequests = summaries.map((s) =>
          this.getById(s.id).pipe(
            catchError((err) => {
              console.error(`[RoutineApiService] Erro ao buscar detalhes da rotina individual (ID: ${s.id}):`, err);
              return of(null); // Retorna nulo para não quebrar as demais requisições do forkJoin
            })
          )
        );

        return forkJoin(detailRequests).pipe(
          map((results) => results.filter((r): r is RoutineDto => r !== null))
        );
      })
    );
  }

  getAll(): Observable<RoutineSummaryResponse[]> {
    return this.http.get<RoutineSummaryResponse[]>(this.baseUrl);
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

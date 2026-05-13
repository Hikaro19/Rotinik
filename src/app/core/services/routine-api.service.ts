import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, switchMap, of } from 'rxjs';
import { environment } from '@environments/environment';
import {
  CompleteTaskResponseDto,
  CreateRoutineRequestDto,
  CreateTaskRequestDto,
  RoutineDto,
  RoutinesSnapshotDto,
  RoutineSummaryResponse,
  UpdateRoutineRequestDto,
} from '@core/models/api';

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private readonly http = inject(HttpClient);
  // Backend route is /api/Routine
  private readonly baseUrl = `${environment.apiBaseUrl}/Routine`;

  /**
   * Emulates the old getSnapshot by fetching all routines and then fetching details for each.
   * This bridges the gap between the new backend (which splits GET /Routine and GET /Routine/:id)
   * and the current frontend UI which expects all tasks loaded upfront.
   */
  getSnapshot(): Observable<RoutineDto[]> {
    return this.getAll().pipe(
      switchMap((summaries) => {
        if (!summaries || summaries.length === 0) {
          return of([]);
        }
        // Fetch full details for each routine to get tasks
        const detailRequests = summaries.map((s) => this.getById(s.id));
        return forkJoin(detailRequests);
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

  // --- Task endpoints (Will need refactoring later to match FMRT_7-14 exactly) ---
  
  addTask(routineId: string, payload: CreateTaskRequestDto): Observable<RoutineDto> {
    // Current frontend calls POST /routines/:id/tasks (not strictly FMRT_7 which links existing tasks)
    return this.http.post<RoutineDto>(`${this.baseUrl}/${routineId}/tasks`, payload);
  }

  deleteTask(routineId: string, taskId: string): Observable<RoutineDto> {
    return this.http.delete<RoutineDto>(`${this.baseUrl}/${routineId}/tasks/${taskId}`);
  }

  completeTask(routineId: string, taskId: string): Observable<CompleteTaskResponseDto> {
    return this.http.post<CompleteTaskResponseDto>(`${this.baseUrl}/${routineId}/tasks/${taskId}/complete`, {});
  }
}

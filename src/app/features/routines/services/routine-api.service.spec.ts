import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RoutineApiService } from './routine-api.service';
import { environment } from '@environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';


describe('RoutineApiService', () => {
  let service: RoutineApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl || environment.apiUrl}/Routine`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoutineApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RoutineApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all routines', () => {
    const mockResponse: any = { user: {}, routines: [] };

    service.getAll().subscribe((res) => {
      expect(res).toEqual([]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a routine', () => {
    const payload: any = { title: 'Test Routine', category: 'Health', frequency: 'daily' };
    const mockResponse: any = { id: '1', ...payload };

    service.create(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should delete a routine', () => {
    const routineId = '1';

    service.delete(routineId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${routineId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

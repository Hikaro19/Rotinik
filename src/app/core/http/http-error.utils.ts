import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AppHttpError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  url?: string | null;
  originalError?: unknown;
}

export function normalizeHttpError(error: unknown, fallbackMessage = 'Erro inesperado de comunicacao.'): AppHttpError {
  if (isAppHttpError(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    const payload = error.error;
    const message =
      (typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : undefined) ??
      (typeof payload === 'object' && payload !== null && 'title' in payload && typeof payload.title === 'string'
        ? payload.title
        : undefined) ??
      error.message ??
      fallbackMessage;

    const code =
      typeof payload === 'object' && payload !== null && 'code' in payload && typeof payload.code === 'string'
        ? payload.code
        : undefined;

    const details =
      typeof payload === 'object' && payload !== null && 'errors' in payload ? payload.errors : payload;

    return {
      status: error.status,
      message,
      code,
      details,
      url: error.url,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message || fallbackMessage,
      originalError: error,
    };
  }

  return {
    status: 0,
    message: fallbackMessage,
    originalError: error,
  };
}

export function getHttpErrorMessage(error: unknown, fallbackMessage: string): string {
  return normalizeHttpError(error, fallbackMessage).message || fallbackMessage;
}

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error) => throwError(() => normalizeHttpError(error))),
  );

function isAppHttpError(error: unknown): error is AppHttpError {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error;
}

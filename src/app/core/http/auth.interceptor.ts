import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH } from '../../shared/utils/constants';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[Interceptor] Chamado para:', request.url, '| Token:', token ? 'existe' : 'null');

  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }));
};
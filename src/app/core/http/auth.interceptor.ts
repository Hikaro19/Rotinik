import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH } from '../../shared/utils/constants';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Leitura SÍNCRONA direta do storage. Isso sobrevive ao Ctrl+F5 imediatamente 
  // e elimina o atraso de inicialização dos Services (condição de corrida).
  const token = localStorage.getItem(AUTH.TOKEN_KEY);

  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }));
};
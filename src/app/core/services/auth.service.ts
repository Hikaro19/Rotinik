import { Injectable } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  recuperarSenha(email: string): Observable<void> {
    console.log(`[AuthService] Recuperacao de senha solicitada para: ${email}`);
    return timer(1200).pipe(map(() => void 0));
  }
}

import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export class FormUtils {
    /**
     * Mapeia erros do FluentValidation (C#) dinamicamente para os controles do Angular
     */
    static applyBackendErrorsToForm(form: FormGroup, backendErrors: Record<string, string[]>): void {
        Object.keys(backendErrors).forEach((key) => {
            // Converte a chave do C# (Ex: 'UserName') para Angular (Ex: 'userName')
            const controlName = key.charAt(0).toLowerCase() + key.slice(1);
            const formControl = form.get(controlName);

            if (formControl) {
                formControl.setErrors({ backend: backendErrors[key][0] });
            }
        });
    }

    /**
     * Processa o HttpErrorResponse e retorna uma mensagem amigável padronizada
     */
    static extractErrorMessage(err: HttpErrorResponse, defaultAuthMessage: string): string {
        if (err.status === 400 && err.error?.errors) {
            return 'Por favor, corrija os campos destacados.';
        }

        if (err.status === 401 || err.status === 409) {
            return err.error?.message || defaultAuthMessage;
        }

        return 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
    }
}
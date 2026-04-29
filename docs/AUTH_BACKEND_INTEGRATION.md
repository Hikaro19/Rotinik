# Integracao de Auth com Backend

Este documento mostra onde Pedro Ivo, Gabriel Geraldini, Pedro Henrique e Hikaro devem mexer quando precisarem ajustar login, registro ou consumo autenticado da API.

## Base de ambiente

Arquivo: `src/environments/environment.ts`

- `apiUrl`: base oficial da Web API local, hoje `http://localhost:5206/api`.
- `apiBaseUrl`: mantido com o mesmo valor para compatibilidade com services antigos.
- `tokenStorageKey`: chave usada para salvar o JWT no `localStorage`.

## Contratos da API

Arquivo: `src/app/core/models/api/user-api.models.ts`

- `UserRegistrationDto`: espelha o `UserRegistrationDto` do backend com `name`, `birthDate`, `userName`, `password` e `email`.
- `UserLoginDto`: espelha o `UserLoginDto` com `userName` e `password`.
- `UserLoginResponseDto`: captura `userId`, `userName` e `token` retornados pelo login.

Se o `UserController.cs` mudar nomes ou campos, este e o primeiro arquivo a revisar.

## AuthService

Arquivo: `src/app/core/services/auth.service.ts`

Responsabilidade: falar diretamente com o backend via `HttpClient`.

- `register(...)`: chama `POST /api/User/register`.
- `login(...)`: chama `POST /api/User/login` e salva `token`, `userId` e `userName`.
- `getToken()`: usado pelo interceptor para montar o header `Authorization`.
- `logout()`: remove a sessao local.

Este service deve continuar fino: request HTTP, persistencia simples de sessao e nada de regra visual.

## AuthFacadeService

Arquivo: `src/app/core/services/auth-facade.service.ts`

Responsabilidade: coordenar o fluxo usado pelas telas.

- Controla `isLoading`, `errorMessage`, `session` e `isAuthenticated`.
- Decide para onde navegar no sucesso.
- Converte erros HTTP em mensagens amigaveis.

Componentes de tela devem chamar a facade e ler signals dela, sem conhecer URL, DTO de resposta ou detalhes do `HttpClient`.

## Auth Interceptor

Arquivo: `src/app/core/http/auth.interceptor.ts`

Responsabilidade: anexar `Authorization: Bearer <token>` em chamadas HTTP quando houver token salvo.

Ele e uma funcao (`HttpInterceptorFn`), que e o formato recomendado para Angular standalone.

## Bootstrap Angular

Arquivo: `src/main.ts`

Responsabilidade: registrar os interceptors no `provideHttpClient`.

Ordem atual:

1. `authInterceptor`: adiciona o token.
2. `httpErrorInterceptor`: normaliza erros para a aplicacao.

## Telas de Login e Registro

Arquivos:

- `src/app/features/auth/login/login.component.ts`
- `src/app/features/auth/login/login.component.html`
- `src/app/features/auth/register/register.component.ts`
- `src/app/features/auth/register/register.component.html`

Responsabilidade: validar campos locais e chamar a `AuthFacadeService`.

A tela de login envia `userName` e `password`. A tela de registro envia `name`, `birthDate`, `userName`, `password` e `email`.

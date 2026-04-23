# API Integration Plan

## Objetivo

Migrar o frontend do modo prototipo para consumo consistente de uma API ASP.NET Core, com contratos claros, estado assincrono e separacao entre dados temporarios e codigo de producao.

## Principios

1. Backend e a fonte oficial de verdade
2. Frontend nao calcula regra oficial de gamificacao
3. DTOs e view models possuem papeis distintos
4. Cada feature usa `ApiService + Facade/Store`

## Recursos Prioritarios

### Routines

- `GET /api/v1/routines`
- `GET /api/v1/routines/{id}`
- `POST /api/v1/routines`
- `PUT /api/v1/routines/{id}`
- `DELETE /api/v1/routines/{id}`
- `POST /api/v1/routines/{id}/tasks`
- `DELETE /api/v1/routines/{id}/tasks/{taskId}`
- `POST /api/v1/routines/{id}/tasks/{taskId}/complete`

### Profile

- `GET /api/v1/profile`

### Futuros

- `GET /api/v1/shop`
- `POST /api/v1/shop/purchases`
- `GET /api/v1/friends`
- `GET /api/v1/feed`
- `GET /api/v1/leaderboard`

## Contrato de Resposta

### Datas

- sempre em ISO-8601

### Erros

Formato sugerido:

```json
{
  "code": "routine_not_found",
  "message": "Routine not found",
  "details": {}
}
```

### Auth

- `Authorization: Bearer <token>`
- refresh token em fluxo separado

## Responsabilidades do Frontend

### ApiService

- fazer request
- retornar `Observable<Dto>`

### Facade/Store

- controlar `loading`, `error`, `data`
- atualizar signals
- disparar refresh apos comandos mutaveis

### Mapper

- DTO -> view model
- form value -> request DTO

## Estrategia de Migracao

1. Isolar mock em arquivos dedicados
2. Preservar interface publica dos services atuais
3. Migrar primeiro `RoutineService`
4. Repetir o padrao em `ProfileService`
5. Expandir para modulos sociais e loja

## Requisitos Tecnicos

- interceptors para auth e erro
- retries controlados para leitura
- mensagens de erro amigaveis para UI
- flags de ambiente sem esconder mock dentro da mesma classe

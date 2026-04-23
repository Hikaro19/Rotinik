# Rotinik Architecture

## Objetivo

Preparar o frontend Angular para operar como cliente de uma API ASP.NET Core sem carregar regra de negocio autoritativa, mocks embutidos e duplicacao de responsabilidades entre UI, estado e dominio.

## Arquitetura Alvo

```text
Angular UI
  -> Feature Facades / Stores
    -> Api Services (HttpClient)
      -> ASP.NET Core Web API
        -> Application + Domain + Persistence
```

## Camadas do Frontend

### 1. UI

- Componentes standalone
- Views por feature em `src/app/features`
- Componentes reutilizaveis em `src/app/shared/components`
- Regra: componentes recebem dados prontos e emitem eventos; nao conhecem contrato HTTP

### 2. Facades / Stores

- Responsaveis por `loading`, `error`, `data` e comandos assinc
- Expostos via `signal`, `computed` e, quando necessario, `Observable`
- Devem ser o ponto de contato das telas com a feature

Exemplos de responsabilidades:

- `loadSnapshot()`
- `createRoutine()`
- `completeTask()`
- `refreshProfile()`

### 3. Api Services

- Wrappers finos de `HttpClient`
- Sem estado de tela
- Sem transformacoes de UI
- Sem mock embutido

Exemplo:

```ts
getSnapshot(): Observable<RoutinesSnapshotDto>
create(payload: CreateRoutineRequestDto): Observable<RoutineDto>
```

### 4. Mappers

- Convertem DTOs da API em view models
- Convertem formularios em payloads
- Opcionalmente adaptam modelos de dominio leves para a UI

## Dominio no Frontend

As classes `Usuario`, `Rotina` e `Tarefa` continuam uteis para demonstrar modelagem e encapsulamento, mas deixam de ser a autoridade final sobre:

- XP
- moedas
- streak
- progressao de nivel
- conclusao oficial de rotina

Essas regras passam a ser responsabilidade do backend C#.

No frontend, o dominio fica restrito a:

- validacoes locais
- comportamento de apoio a interface
- composicao de estado derivado

## Estrutura Recomendada

```text
src/app/
|-- core/
|   |-- models/
|   |   |-- api/
|   |   `-- domain/
|   |-- mocks/
|   |-- mappers/
|   `-- services/
|       |-- api/
|       `-- facade/
|-- features/
|-- shared/
```

## Estado e Assincronia

### Convencao

- `ApiService`: retorna `Observable`
- `Facade/Store`: consome observables, atualiza `signal`
- `Component`: le `signal` e dispara eventos

### Exemplo

```text
Component -> facade.createRoutine(payload)
Facade -> api.create(payload)
Api -> backend
Facade -> atualiza state
Component -> renderiza novo state
```

## Estrategia de Integracao com Backend

### Contratos

- DTOs versionados por recurso
- erros padronizados
- datas em ISO-8601
- ids opacos controlados pelo backend

### Infraestrutura

- `provideHttpClient()`
- interceptors para auth e erro
- environment por ambiente
- `apiBaseUrl` e `apiVersion`

## Design System

### Regras

- Montserrat como fonte global
- tokens em `src/styles.scss`
- sem CSS inline em features
- sem hardcode de cor quando houver token equivalente
- sem `transition: all`

## Diretrizes de Componentizacao

Priorizar extração de:

- cards de rotina
- filtros pill/tab
- paineis de secao
- badges de recompensa
- estados vazios
- hero de perfil

## Decisoes de Refatoracao

1. Remover mocks embutidos dos services principais
2. Preservar a API publica usada pelas telas durante a transicao
3. Introduzir mappers dedicados onde a complexidade justificar
4. Consolidar componentes compartilhados antes de expandir novas features

## Riscos Atuais

- Services com responsabilidade excessiva
- divergencia entre documentacao e implementacao real
- duplicacao de HTML/SCSS entre Home e Routines
- uso de bindings de estilo e transicoes genericas
- acessibilidade parcial em modal/toast

## Proximos Passos

1. Isolar mocks
2. Refatorar rotina para `Api + Facade + Mapper`
3. Migrar profile/shop/friends/feed para o mesmo padrao
4. Reaproveitar componentes compartilhados nas views principais
5. Adicionar interceptors, auth e tratamento global de erros

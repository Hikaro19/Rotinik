# Rotinik

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Backend Target](https://img.shields.io/badge/API-ASP.NET%20Core-512BD4?logo=dotnet&logoColor=white)

Rotinik transforma rotina em progresso visivel. O produto usa gamificacao para combater a procrastinacao com loops claros de recompensa: tarefas geram XP, moedas, streaks, historico e motivacao para manter consistencia no dia a dia.

Hoje o repositorio representa o frontend em Angular da plataforma. A base foi iniciada como prototipo academico, mas esta sendo evoluida para uma arquitetura real de integracao com backend em C#.

## Proposta de Valor

- Quebra objetivos grandes em tarefas pequenas e acompanhaveis
- Recompensa execucao com XP, moedas e progresso de nivel
- Usa rotina, loja, perfil e elementos sociais para reforcar consistencia
- Converte um problema subjetivo, procrastinacao, em feedback visual e mensuravel

## Visao de Arquitetura

### Frontend

- Angular 18 com Standalone Components
- Signals e computed para estado de leitura e derivacoes de UI
- HttpClient para integracao com API REST
- SCSS com design system dark gamificado e fonte Montserrat

### Backend Alvo

- ASP.NET Core Web API
- DTOs versionados por recurso
- JWT para autenticacao
- Regras oficiais de XP, moedas, streaks e progresso executadas no servidor

### Contrato Arquitetural

O frontend deixa de ser a fonte de verdade do dominio e passa a atuar em quatro camadas:

1. `ApiServices`: clientes HTTP puros
2. `Stores/Facades`: carregamento, cache local, loading/error e exposicao para a UI
3. `Mappers`: conversao entre DTOs, view models e modelos de dominio leves
4. `Shared/UI`: componentes de apresentacao reutilizaveis

## O que o Projeto Demonstra

- Organizacao por `core`, `features` e `shared`
- Modelagem orientada a objetos no frontend para explorar regras de dominio
- Uso de Signals para compor dashboards e estados derivados
- Preparacao para migrar de mock local para integracao real com API C#

## Features Atuais

- Autenticacao com telas de login e cadastro
- Dashboard inicial com progresso do usuario
- CRUD local de rotinas e tarefas
- Sistema gamificado de XP, niveis e moedas
- Loja, inventario e historico
- Perfil com estatisticas, heatmap, achievements e historico
- Modulos sociais com amigos, feed e leaderboard

## Roadmap de Evolucao

- Reposicionar a documentacao para avaliadores tecnicos e recrutadores
- Isolar mocks do codigo de producao
- Refatorar services para `HttpClient + facade/store`
- Componentizar blocos repetidos de Home, Routines e Profile
- Padronizar acessibilidade, estados assinc e design system

## Estrutura Principal

```text
src/
|-- app/
|   |-- core/
|   |   |-- models/             # DTOs e modelos de dominio
|   |   |-- services/           # API clients, facades e stores
|   |   `-- mocks/              # Dados temporarios enquanto a API nao assume a fonte oficial
|   |-- features/               # Views e fluxos por dominio
|   `-- shared/                 # Componentes UI e feature components reutilizaveis
|-- environments/
|-- main.ts
`-- styles.scss
```

## Como Rodar

```bash
npm install
npm start
```

App local:

```text
http://localhost:4200
```

## Scripts

```bash
npm start
npm run build
npm run build:prod
npm test
npm run format
npm run format:check
```

## Documentacao Complementar

- [Visao de Produto](./docs/PRODUCT_OVERVIEW.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Plano de Integracao com API](./docs/API_INTEGRATION_PLAN.md)

## Status Atual

O frontend esta em transicao de prototipo para arquitetura integrada com backend real. O foco atual da refatoracao e remover mocks embutidos dos services, consolidar componentes compartilhados e formalizar o contrato Angular + C#.

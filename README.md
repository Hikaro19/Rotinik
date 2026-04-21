# Rotinik

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Rotinik e um MVP academico de produtividade com gamificacao, criado para transformar combate a procrastinacao em uma experiencia mais visual, motivadora e progressiva. O app recompensa consistencia com XP, moedas, streaks, loja, progresso de rotinas e elementos sociais.

## Sobre o Projeto

O projeto foi desenvolvido no contexto da disciplina de Programacao Orientada a Objetos II da UVV. A proposta e aplicar conceitos de POO em um frontend moderno, usando o dominio do produto para representar rotinas, tarefas, recompensas, perfil e progresso do usuario.

Na pratica, o Rotinik ajuda o usuario a quebrar objetivos em tarefas menores e acompanhaveis. Cada conclusao gera recompensas no ecossistema do app:

- XP para evolucao de nivel
- moedas para compras na loja
- progresso de rotinas diarias, semanais e mensais
- historico de atividade e sinais de consistencia
- interacoes sociais como feed, amigos e leaderboard

## Arquitetura e POO

O frontend segue uma arquitetura organizada em `core`, `features` e `shared`, usando Angular com componentes standalone, lazy loading por rota, `signals` e `computed` para estado reativo e SCSS para o design system gamificado.

### Como a POO aparece no projeto

- Classes de dominio encapsulam regras de negocio em `src/app/core/models/domain`, com destaque para `Rotina`, `Tarefa`, `Usuario`, `Perfil`, `Recompensa` e itens de loja.
- Services com `@Injectable({ providedIn: 'root' })` atuam como singletons da aplicacao, centralizando estado e comportamento em servicos como `GamificationService`, `RoutineService`, `ProfileService`, `ShopService` e `FriendsService`.
- O padrao `State` aparece na modelagem de tarefas, onde `Tarefa` delega transicoes para estados como `TarefaPendente`, `TarefaEmAndamento` e `TarefaConcluida`.
- O padrao `Strategy` aparece no calculo de progresso de rotinas, permitindo trocar algoritmos por meio de estrategias como `EstrategiaProgresoLinear`, `EstrategiaProgresoComPeso` e `EstrategiaProgresoExponencial`.
- O app separa modelagem de dominio de modelos de apresentacao, por exemplo quando `RoutineService` mapeia a classe `Rotina` para um view model consumido pela UI.

### Frontend

- Angular standalone e rotas com `loadComponent`
- estado local e derivado com `signal` e `computed`
- SCSS com design system dark e linguagem visual gamificada
- estrutura orientada a features para facilitar manutencao e evolucao

Observacao importante: a base atual do repositorio esta em Angular `18.2.x`. A abordagem arquitetural, no entanto, continua alinhada ao que voces documentaram para Angular Standalone + Signals.

## Features Principais

- ✅ Autenticacao com telas de login e cadastro
- ✅ Dashboard inicial com visao de progresso, rotinas e estatisticas
- ✅ CRUD basico de rotinas no frontend
- ✅ Detalhamento de rotina e tarefas
- ✅ Sistema de XP, niveis, moedas e transacoes gamificadas
- ✅ Loja com catalogo, compra de itens e inventario
- ✅ Perfil com estatisticas, achievements, heatmap de atividade e historico
- ✅ Modulos sociais com amigos, requisicoes, feed e leaderboard
- ✅ Biblioteca de componentes reutilizaveis (`button`, `input`, `card`, `modal`, `toast`, `spinner`)
- ✅ Validadores, helpers e constantes compartilhadas
- ✅ Roteamento com layout principal e areas publicas/privadas

## Stack Tecnologica

- Angular 18 com arquitetura baseada em Standalone Components
- TypeScript 5.5
- SCSS com dark mode gamificado e design tokens globais
- Angular Signals e `computed` para reatividade
- RxJS na base do ecossistema Angular
- Angular Router para lazy loading e navegacao por features
- Vercel para publicacao

## Estrutura Principal

```text
src/
|-- app/
|   |-- core/
|   |   |-- models/domain/       # Entidades e regras de negocio
|   |   `-- services/            # Estado global e casos de uso
|   |-- features/
|   |   |-- auth/                # Login e cadastro
|   |   |-- home/                # Dashboard inicial
|   |   |-- routines/            # Rotinas e detalhes
|   |   |-- profile/             # Perfil e historico
|   |   |-- shop/                # Loja e inventario
|   |   `-- friends/             # Amigos, feed e ranking
|   `-- shared/
|       |-- components/ui/       # Componentes base reutilizaveis
|       |-- components/feature/  # Componentes compostos da aplicacao
|       `-- utils/               # Validators, helpers e constantes
|-- environments/
|-- main.ts
`-- styles.scss
```

## Quick Start

### 1. Instale as dependencias

```bash
npm install
```

### 2. Rode a aplicacao em desenvolvimento

```bash
npm start
```

### 3. Acesse no navegador

```text
http://localhost:4200
```

Rotas uteis:

- `http://localhost:4200/auth/login`
- `http://localhost:4200/auth/register`
- `http://localhost:4200/home`

## Scripts Uteis

```bash
npm start
npm run build
npm run build:prod
npm test
npm run format
npm run format:check
```

## Referencia Tecnica Complementar

Para detalhes mais densos de arquitetura, padroes e organizacao historica do projeto, consulte [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Status

O repositorio agora concentra a documentacao principal neste arquivo. A ideia e manter o `README.md` como porta de entrada unica para onboarding, entendimento do produto e setup local.

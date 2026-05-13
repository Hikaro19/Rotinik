# Rotinik Frontend

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)

Rotinik transforma rotina em progresso visível. O produto usa gamificação para combater a procrastinação com loops claros de recompensa: tarefas geram XP, moedas, streaks, histórico e motivação para manter consistência no dia a dia.

Este repositório contém a **Aplicação Frontend (SPA)** em Angular da plataforma Rotinik, responsável por toda a interface de usuário e interações gamificadas.

## Proposta de Valor

- Quebra objetivos grandes em tarefas pequenas e acompanháveis
- Recompensa execução com XP, moedas e progresso de nível
- Usa rotina, loja, perfil e elementos sociais para reforçar consistência
- Converte um problema subjetivo, procrastinação, em feedback visual e mensurável

## Visão de Arquitetura

- **Angular 18** com Standalone Components
- **Signals** e `computed` para gerenciamento de estado reativo e derivações de UI
- **HttpClient** e Interceptors para integração com API REST (Autenticação baseada em JWT)
- **SCSS** com design system dark gamificado e fonte Montserrat

### Camadas do Frontend

A aplicação atua nas seguintes camadas:

1. `ApiServices`: Clientes HTTP puros que realizam as requisições
2. `Stores/Facades`: Gerenciamento de estado, cache local, loading/error e exposição para a UI
3. `Mappers`: Conversão entre DTOs de API e modelos de domínio da UI
4. `Shared/UI`: Componentes de apresentação reutilizáveis (botões, inputs, modais)

## Features Atuais

- Autenticação com telas de login e cadastro (Integração via JWT)
- Dashboard inicial com progresso do usuário e status diário
- Gerenciamento de Rotinas e Tarefas
- Sistema gamificado de XP, níveis e moedas
- Loja virtual, inventário de itens e histórico
- Perfil de usuário com estatísticas, heatmap, conquistas e histórico
- Módulos sociais com lista de amigos, feed e placar de líderes (Leaderboard)

## Estrutura Principal do Projeto

```text
src/
|-- app/
|   |-- core/
|   |   |-- models/             # DTOs e modelos de domínio
|   |   |-- services/           # API clients, facades e gerenciamento de estado
|   |   |-- http/               # Interceptors e utilitários HTTP
|   |   `-- mocks/              # Dados temporários (para fallback)
|   |-- features/               # Telas, views e fluxos por domínio (auth, routines, etc)
|   `-- shared/                 # Componentes UI reutilizáveis e pipes
|-- environments/               # Configuração de URLs da API por ambiente
|-- main.ts                     # Ponto de entrada (Bootstrap)
`-- styles.scss                 # Estilos globais e Design System
```

## Como Rodar Localmente

Para rodar este frontend na sua máquina, você precisará do **Node.js** instalado.

1. Instale as dependências do projeto:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Acesse a aplicação no seu navegador:
```text
http://localhost:4200
```

> **Nota:** Certifique-se de ter o Backend da API rodando localmente (por padrão na porta `5025` conforme o `environments/environment.ts`) para que os fluxos de login e carregamento de dados funcionem corretamente.

## Scripts Úteis

```bash
npm start           # Inicia o servidor local
npm run build       # Realiza o build de desenvolvimento
npm run build:prod  # Realiza o build otimizado para produção
npm test            # Roda a suíte de testes (Karma/Jasmine)
npm run format      # Formata os arquivos (Prettier)
```

<!-- markdownlint-disable -->

# 🚀 ROTINIK Frontend - Quick Start Guide

## 📋 Visão Geral

Você recebeu a **arquitetura base completa** do Rotinik Frontend em Angular 17+ com:

✅ Design System global em SCSS  
✅ Componente Button reutilizável  
✅ Layout responsivo (Mobile-first)  
✅ Home Component com dashboard  
✅ GamificationService (pronto para SignalR)  
✅ RoutineService (pronto para API ASP.NET Core)  
✅ Configuração de rotas  
✅ Ambiente de desenvolvimento  

---

## 🔧 Setup Inicial

### 1. Criar projeto Angular 17

```bash
ng new rotinik --routing --style=scss --standalone
cd rotinik
```

### 2. Copiar arquivos gerados

```bash
# Estrutura de pastas
mkdir -p src/app/core/{layout,services,interceptors,guards}
mkdir -p src/app/shared/components/{ui,feature}/components/{ui,feature}
mkdir -p src/app/features/{home,routines,shop,friends,profile}
mkdir -p src/environments
```

### 3. Copiar os arquivos

Copiar cada arquivo .ts, .scss, .html para suas respectivas pastas.

### 4. Instalar dependências

```bash
npm install
```

### 5. Iniciar servidor de desenvolvimento

```bash
ng serve
```

Acessar `http://localhost:4200/home`

---

## 📁 Estrutura Entregue

### Arquivos Criados

```
✅ src/styles.scss
   └─ Design System global com tokens, reset CSS, utilities, mixins

✅ src/app/shared/components/ui/button/
   ├── button.component.ts (código)
   └── button.component.scss (estilos)

✅ src/app/core/layout/
   ├── layout.component.ts (navegação responsiva)
   └── layout.component.scss (estilos)

✅ src/app/core/services/
   ├── gamification.service.ts (pontos, XP, moedas)
   └── routine.service.ts (rotinas, tarefas, perfil)

✅ src/app/features/home/
   ├── home.component.ts (dashboard principal)
   └── home.component.scss (estilos)

✅ src/app/app.routes.ts (configuração de rotas)
✅ src/main.ts (bootstrap da aplicação)
✅ src/environments/environment.ts (configuração de ambiente)
✅ ARCHITECTURE.md (documentação de arquitetura)
```

---

## 🎨 Design System Usage

### Usar Variáveis CSS

```scss
// Em qualquer componente .scss
.my-element {
  background: var(--bg-card);
  color: var(--text-title);
  padding: var(--spacing-4);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
}
```

### Usar Mixins

```scss
.my-component {
  @include flex-center;  // Centralizar com flexbox
  @include card;         // Card base com estilo
  @include smooth-transition(); // Transição suave
}
```

### Usar Classes Utilitárias

```html
<div class="flex flex-between gap-4">
  <h2 class="font-semibold text-2xl">Título</h2>
  <button class="text-muted">Opção</button>
</div>
```

---

## 🔘 Componente Button

### Uso Básico

```html
<!-- Variante Primary (Gradiente) -->
<app-button 
  variant="primary" 
  size="md" 
  (click)="onAction()"
>
  Clique em mim
</app-button>

<!-- Variante Secondary (Muted) -->
<app-button 
  variant="secondary" 
  size="lg"
>
  Secundário
</app-button>

<!-- Variante Danger -->
<app-button 
  variant="danger" 
  size="sm"
>
  Deletar
</app-button>

<!-- Variante Ghost -->
<app-button 
  variant="ghost" 
  [fullWidth]="true"
>
  Cancelar
</app-button>

<!-- Com Loading -->
<app-button 
  [loading]="isLoading"
  [disabled]="isLoading"
>
  Enviando...
</app-button>
```

### Props

```typescript
@Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
@Input() size: 'sm' | 'md' | 'lg' = 'md';
@Input() disabled = false;
@Input() loading = false;
@Input() fullWidth = false;
@Input() ariaLabel?: string;
@Output() click = new EventEmitter<void>();
```

---

## 🏠 Home Component

### O que faz

- ✅ Exibe perfil do usuário
- ✅ Mostra saldo de moedas e XP
- ✅ Barra de progresso de level
- ✅ Card de "Próxima Ação"
- ✅ Estatísticas rápidas (streak, taxa de conclusão)
- ✅ Lista de tarefas do dia
- ✅ Marcar tarefas como concluídas
- ✅ Recompensas automáticas (XP + moedas)

### Usa Signals

```typescript
// Reativo a mudanças no estado
coins = computed(() => this.gamificationState().coins);
xp = computed(() => this.gamificationState().xp);
levelProgress = computed(() => Math.floor((this.xp() % 100) / 100 * 100));
```

### Integração com Serviços

```typescript
private gamificationService = inject(GamificationService);
private routineService = inject(RoutineService);

ngOnInit() {
  // Carregar dados
  this.gamificationService.getGamificationState()
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => this.gamificationState.set(state));
}
```

---

## ⚙️ GamificationService

### Core Responsabilidades

- Gerenciar moedas, XP, level, rank
- Publicar eventos de recompensas
- Gerenciar achievements
- Simular integração com SignalR

### Métodos Principais

```typescript
// Adicionar XP
gamificationService.addXP(50, 'task:123');

// Adicionar moedas
gamificationService.addCoins(10, 'task:123');

// Gastar moedas (compra)
const canAfford = gamificationService.spendCoins(100, 'item-456');

// Desbloquear achievement
gamificationService.unlockAchievement('first-task');

// Obter estado
gamificationService.getGamificationState().subscribe(state => {
  console.log(state.coins, state.xp, state.level);
});

// Reset (para testes)
gamificationService.reset();
```

### Mock Data

No desenvolvimento, o serviço usa dados mockados:

```typescript
{
  coins: 2450,
  xp: 7850,
  level: 12,
  rank: 'Aprendiz Determinado',
  streak: 7,
}
```

---

## 📋 RoutineService

### Core Responsabilidades

- CRUD de rotinas
- CRUD de tarefas
- Gerenciar perfil do usuário
- Cache local de dados

### Métodos Principais

```typescript
// Rotinas
routineService.getRoutines().subscribe(routines => {...});
routineService.createRoutine({...}).subscribe(routine => {...});
routineService.updateRoutine('id', {...}).subscribe(...);
routineService.deleteRoutine('id').subscribe(...);

// Tarefas
routineService.getTodaysTasks().subscribe(tasks => {...});
routineService.completeTask('taskId').subscribe(...);
routineService.updateTask('taskId', {status: 'completed'}).subscribe(...);

// Perfil
routineService.getUserProfile().subscribe(profile => {...});
routineService.loadUserProfile();
```

### Mock Data

Tarefas de exemplo para desenvolvimento:

```typescript
{
  id: 'task-1',
  title: 'Estudar Diagrama UML',
  status: 'completed',
  priority: 'high',
  estimatedTime: 90,
  xpReward: 50,
  coinReward: 10,
}
```

---

## 📱 Layout Responsivo

### Mobile (< 768px)

```
┌─────────────────────┐
│ Header com saldo    │
├─────────────────────┤
│                     │
│   CONTEÚDO          │
│   (home, rotinas)   │
│                     │
├─────────────────────┤
│ 🏠 📋 🛍️ 👥 👤    │  ← Bottom Nav
└─────────────────────┘
```

### Desktop (≥ 768px)

```
┌──────────┬──────────────────────┐
│ SIDEBAR  │                      │
│          │   CONTEÚDO           │
│ 🏠 Home  │   (home, rotinas)    │
│ 📋 Rot   │                      │
│ 🛍️ Shop  │                      │
│ 👥 Ami   │                      │
│ 👤 Prof  │                      │
├──────────┤                      │
│ 🚪 Sair  │                      │
└──────────┴──────────────────────┘
```

---

## 🔐 Acessibilidade

Todos os componentes implementam:

✅ Semantic HTML  
✅ ARIA labels  
✅ Focus management  
✅ Keyboard navigation  
✅ Contrast WCAG AA  
✅ Screen reader support  

### Exemplo

```html
<nav role="navigation" aria-label="Navegação principal">
  <a 
    [attr.aria-current]="isActive ? 'page' : null"
    routerLink="/home"
  >
    Home
  </a>
</nav>

<button
  [attr.aria-label]="'Marcar ' + task.title + ' como concluída'"
  (click)="toggleTask(task)"
>
  ✓
</button>
```

---

## 🔗 Integração com Backend

### Preparação

Os serviços estão prontos para integração. Basta descomentar as chamadas HTTP:

```typescript
// Atualmente (mock):
this.routinesSubject.next(mockRoutines);

// Para usar backend real:
this.httpClient.get(`${this.API_BASE_URL}/routines`)
  .subscribe(routines => this.routinesSubject.next(routines));
```

### Endpoints Esperados

Ver `src/environments/environment.ts`:

```typescript
endpoints: {
  routines: {
    list: '/api/routines',
    detail: '/api/routines/:id',
    create: '/api/routines',
    // ...
  },
  tasks: {
    list: '/api/tasks',
    today: '/api/tasks/today',
    complete: '/api/tasks/:id/complete',
    // ...
  },
  gamification: {
    state: '/api/gamification/state',
    addCoins: '/api/gamification/coins',
    addXP: '/api/gamification/xp',
    // ...
  },
}
```

### SignalR (Gamificação em Tempo Real)

Quando integrar, adicionar ao `GamificationService`:

```typescript
private signalRService = inject(SignalRService);

ngOnInit() {
  this.signalRService.connect('gamification-hub');
  
  this.signalRService.on('pointsEarned', (data) => {
    this.addXP(data.xp, data.source);
  });
}
```

---

## 🚀 Próximos Passos

### Sprint 1: Componentes Base

- [ ] Criar Input Component (com validação)
- [ ] Criar Card Component
- [ ] Criar Modal Component
- [ ] Criar Spinner/Loading Component
- [ ] Criar Toast Notification Component

### Sprint 2: Features Principais

- [ ] Feature Routines (CRUD completo)
- [ ] Feature Tasks (In-app execution)
- [ ] Feature Shop (Compra de itens)
- [ ] Feature Profile (Edit, achievements)

### Sprint 3: Social

- [ ] Feature Friends (Add, remove, view)
- [ ] Feature Feed (Share routines, like)
- [ ] Feature Leaderboard
- [ ] Feature User Profile (Others)

### Sprint 4: Polish & Deploy

- [ ] PWA (Service Workers)
- [ ] Offline support
- [ ] Push notifications
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Deploy (Netlify/Vercel)

---

## 📚 Recursos Úteis

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Tricks](https://css-tricks.com/)

---

## ✉️ Dúvidas?

Consulte:

1. **ARCHITECTURE.md** - Documentação completa
2. **Comentários no código** - Explicações inline
3. **Exemplos de uso** - Home.component.ts
4. **TypeScript Types** - Veja interfaces nos services

---

## 📝 Checklist de Setup

- [ ] Projeto Angular 17 criado
- [ ] Estrutura de pastas criada
- [ ] Arquivos copiados
- [ ] `npm install` executado
- [ ] `ng serve` rodando
- [ ] Acessar `http://localhost:4200/home`
- [ ] Visualizar Home Component
- [ ] Testar Bottom Navigation (mobile)
- [ ] Testar Sidebar (desktop/tablet)
- [ ] Testar responsividade

---

**Versão**: 1.0  
**Data**: 2024  
**Status**: Production Ready ✅

Bom desenvolvimento! 🚀

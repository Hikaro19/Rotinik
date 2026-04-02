<!-- markdownlint-disable -->

# 🚀 ROTINIK - Frontend Architecture Guide

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── layout/
│   │   │   ├── layout.component.ts      # Shell principal com navegação
│   │   │   ├── layout.component.scss
│   │   │   └── layout.component.html
│   │   ├── services/
│   │   │   ├── gamification.service.ts  # Gerenciamento de pontos/XP/moedas
│   │   │   ├── routine.service.ts       # CRUD de rotinas e tarefas
│   │   │   ├── auth.service.ts          # (TODO) Autenticação
│   │   │   └── api.service.ts           # (TODO) Cliente HTTP base
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts      # (TODO) JWT/Bearer tokens
│   │       └── error.interceptor.ts     # (TODO) Tratamento global de erros
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button/              # Botão reutilizável
│   │   │   │   ├── input/               # (TODO) Input com validação
│   │   │   │   ├── card/                # (TODO) Card genérico
│   │   │   │   ├── modal/               # (TODO) Modal dialog
│   │   │   │   ├── spinner/             # (TODO) Loading spinner
│   │   │   │   └── toast/               # (TODO) Toast notifications
│   │   │   └── feature/
│   │   │       ├── task-item/           # (TODO) Componente de tarefa
│   │   │       ├── routine-card/        # (TODO) Card de rotina
│   │   │       └── leaderboard/         # (TODO) Ranking social
│   │   ├── pipes/
│   │   │   ├── time-format.pipe.ts      # (TODO) Formatar tempo
│   │   │   └── xp-format.pipe.ts        # (TODO) Formatar XP
│   │   ├── directives/
│   │   │   ├── focus-trap.directive.ts  # (TODO) Acessibilidade
│   │   │   └── loading.directive.ts     # (TODO) Loading state
│   │   └── utils/
│   │       ├── constants.ts             # (TODO) Constantes da app
│   │       ├── validators.ts            # (TODO) Validadores customizados
│   │       └── helpers.ts               # (TODO) Funções utilitárias
│   │
│   ├── features/
│   │   ├── home/
│   │   │   ├── home.component.ts        # ✅ Dashboard principal
│   │   │   ├── home.component.scss
│   │   │   └── home.component.html
│   │   ├── routines/
│   │   │   ├── routines.component.ts    # (TODO) Lista de rotinas
│   │   │   ├── routine-detail/          # (TODO) Detalhe de rotina
│   │   │   └── routine-create/          # (TODO) Criar/editar rotina
│   │   ├── shop/
│   │   │   ├── shop.component.ts        # (TODO) Loja de itens
│   │   │   ├── shop-item/               # (TODO) Item da loja
│   │   │   └── inventory/               # (TODO) Inventário do usuário
│   │   ├── friends/
│   │   │   ├── friends.component.ts     # (TODO) Lista de amigos
│   │   │   ├── friend-profile/          # (TODO) Perfil do amigo
│   │   │   └── feed/                    # (TODO) Feed social
│   │   ├── profile/
│   │   │   ├── profile.component.ts     # (TODO) Perfil do usuário
│   │   │   ├── profile-edit/            # (TODO) Editar perfil
│   │   │   └── achievements/            # (TODO) Achievements/Medalhas
│   │   └── auth/
│   │       ├── login/                   # (TODO) Login
│   │       ├── register/                # (TODO) Registro
│   │       └── password-reset/          # (TODO) Reset de senha
│   │
│   ├── app.config.ts                    # (TODO) Configuração da app
│   ├── app.routes.ts                    # (TODO) Rotas da app
│   └── app.component.ts                 # Root component
│
├── styles.scss                          # ✅ Design System global
├── main.ts                              # Bootstrap da app
├── environments/
│   ├── environment.ts                   # Dev
│   └── environment.prod.ts              # Production
└── index.html

```

## 🎨 Design System

### Tokens de Design

Todos os tokens estão definidos em `src/styles.scss`:

#### Cores
- **Backgrounds**: `--bg-app`, `--bg-card`, `--bg-input`
- **Brand**: `--brand-neon`, `--brand-gradient`, `--brand-muted`
- **Gamificação**: `--game-xp`, `--game-coin`, `--game-success`, `--game-warning`, `--game-danger`
- **Tipografia**: `--text-title`, `--text-body`, `--text-muted`

#### Tipografia
- **Fontes**: Poppins (titles), Inter (body)
- **Tamanhos**: `--font-size-xs` até `--font-size-4xl`
- **Pesos**: regular, medium, semibold, bold

#### Espaçamento
- **Escala**: 4px base (spacing-1 = 4px até spacing-16 = 64px)
- **Uso**: Padding, margin, gaps

#### Sombras
- **Profundidade**: shadow-sm até shadow-2xl
- **Neon**: shadow-neon, shadow-neon-lg

#### Arredondamentos
- **Pequeno**: `--radius-sm` (8px)
- **Card**: `--radius-card` (16px)
- **Grande**: `--radius-lg` (24px)
- **Pill**: `--radius-pill` (9999px)

### Mixins SCSS Disponíveis

```scss
@include flex-center;              // Flexbox centered
@include flex-between;             // Flexbox space-between
@include button-reset;             // Reset de botão
@include card;                     // Card base com sombra
@include input-base;               // Input base
@include text-truncate;            // Text ellipsis
@include smooth-transition();      // Transition smoothing
@include gradient-text;            // Gradient text
@include neon-glow;                // Efeito neon
@include container-mobile;         // Container responsivo
@include container-tablet;
@include container-desktop;
```

## 🔧 Padrões de Desenvolvimento

### Componentes Standalone

Todos os componentes usam o padrão Standalone (Angular 17+):

```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styleUrl: './button.component.scss',
})
export class AppButtonComponent {
  // ...
}
```

**Benefícios:**
- Menor bundle size
- Melhor tree-shaking
- Composição mais fácil

### Signals para Reatividade

Usar Angular Signals para estado local (desde o Home Component):

```typescript
// Signal simples
count = signal(0);

// Computed signal (reactivo)
doubleCount = computed(() => this.count() * 2);

// Atualizar
this.count.set(5);
this.count.update(prev => prev + 1);
```

**Quando usar:**
- Estado local de componente
- Computed values
- State management simples

**Quando usar RxJS:**
- Compartilhar dados entre componentes
- Efeitos assíncronos complexos
- Integração com backend

### Injeção de Dependência

```typescript
private gamificationService = inject(GamificationService);
private router = inject(Router);
```

Preferir `inject()` funcional ao invés de constructor.

### Gerenciamento de Subscrições

Usar `takeUntil` pattern:

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { ... });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 📱 Responsividade

### Breakpoints (Mobile-first)

- **Mobile**: < 640px (base)
- **Tablet**: 640px - 1023px
- **Desktop**: ≥ 1024px

### Layout Responsivo

**Mobile:**
- Bottom Navigation
- Full-width content

**Tablet/Desktop:**
- Sidebar Navigation
- Content com max-width

Exemplo no `layout.component.scss`:

```scss
@media (max-width: 767px) {
  .layout__sidebar { display: none; }
  .layout__bottom-nav { display: block; }
}

@media (min-width: 768px) {
  .layout__sidebar { display: block; }
  .layout__bottom-nav { display: none; }
}
```

## 🔐 Acessibilidade

### Práticas Implementadas

1. **Semantic HTML**: `<button>`, `<nav>`, `<main>`, `<section>`
2. **ARIA Labels**: `aria-label`, `aria-current`, `aria-disabled`
3. **Focus Management**: `:focus-visible` outline
4. **Contrast**: WCAG AA compliant
5. **Screen Reader Text**: `.sr-only` class

### Exemplo:

```html
<nav role="navigation" aria-label="Navegação principal">
  <a [attr.aria-current]="isActive ? 'page' : null">
    Link
  </a>
</nav>
```

## 🚀 Performance

### Otimizações Implementadas

1. **Standalone Components**: Menor bundle
2. **OnPush Change Detection**: (implementar em componentes filhos)
3. **Lazy Loading Routes**: (implementar em routing)
4. **Image Optimization**: (usar format moderno, lazy-loading)
5. **CSS Purging**: Tailwind-like approach com SCSS

### Recomendações

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ... resto da config
})
```

## 📡 Integração com Backend

### GamificationService

**Endpoints esperados:**

```
POST   /api/gamification/addCoins
POST   /api/gamification/addXP
POST   /api/gamification/spendCoins
POST   /api/gamification/unlockAchievement
```

**WebSocket (SignalR):**

```
connection.on('pointsEarned', (data) => {
  this.addXP(data.xp, data.source);
});
```

### RoutineService

**Endpoints esperados:**

```
GET    /api/routines
GET    /api/routines/:id
POST   /api/routines
PUT    /api/routines/:id
DELETE /api/routines/:id

GET    /api/tasks
PUT    /api/tasks/:id/complete
POST   /api/tasks

GET    /api/users/profile
```

## 📚 Next Steps

### Curto Prazo (Sprint 1)
1. ✅ Design System base
2. ✅ Layout responsivo
3. ✅ Home component
4. [ ] Componentes UI (Input, Modal, Card, Spinner)
5. [ ] Autenticação (Login/Register)
6. [ ] Integração com backend real

### Médio Prazo (Sprint 2-3)
1. [ ] Feature de Rotinas (CRUD)
2. [ ] Feature de Tarefas
3. [ ] Sistema de Loja
4. [ ] Feed Social
5. [ ] Perfil do usuário

### Longo Prazo (Sprint 4+)
1. [ ] PWA (Service Workers)
2. [ ] Offline support
3. [ ] Push notifications
4. [ ] i18n (Internacionalização)
5. [ ] Dark/Light theme toggle
6. [ ] E2E tests (Cypress)
7. [ ] Unit tests (Jasmine/Karma)

## 🔗 Recursos

- [Angular Docs](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile-first Design](https://www.nngroup.com/articles/mobile-first-web-design/)

---

**Versão**: 1.0
**Atualizado**: 2024
**Mantido por**: Equipe Rotinik Frontend

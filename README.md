# 🎮 Rotinik Frontend

Bem-vindo ao Rotinik! Uma plataforma de **gamificação de rotinas** construída com Angular 17+ Standalone Components e Design System personalizado.

## ✨ Status da Sprint

| Feature | Status | Localização |
|---------|--------|-------------|
| InputComponent | ✅ Concluído | `src/app/shared/components/ui/input/` |
| ButtonComponent | ✅ Concluído | `src/app/shared/components/ui/button/` |
| LoginComponent | ✅ Concluído | `src/app/features/auth/login/` |
| RegisterComponent | ✅ Concluído | `src/app/features/auth/register/` |
| HomeComponent | ✅ Concluído | `src/app/features/home/` |
| Design System | ✅ Concluído | `src/styles.scss` |
| Validators Customizados | ✅ Concluído | `src/app/shared/utils/` |
| Helpers & Utilities | ✅ Concluído | `src/app/shared/utils/` |

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor Dev
```bash
npm start
# ou
ng serve --open
```

### 3. Acessar a Aplicação
- **URL**: `http://localhost:4200`
- **Login**: `http://localhost:4200/auth/login`
- **Register**: `http://localhost:4200/auth/register`
- **Home**: `http://localhost:4200/home`

### 4. Demo Credentials
```
Email: demo@rotinik.com
Senha: password123
```

---

## 📚 Documentação Completa

### Guias
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - Padrões e estrutura
- 🚀 [QUICK_START.md](./QUICK_START.md) - Setup rápido
- 📋 [SPRINT_1_FASE_2.md](./SPRINT_1_FASE_2.md) - Details desta sprint

### Componentes Criados

#### 🔘 AppButtonComponent
```html
<app-button 
  variant="primary" 
  size="lg" 
  fullWidth
  (buttonClick)="onAction()"
>
  Clique em mim
</app-button>
```

**Variantes**: `primary`, `secondary`, `danger`, `ghost`  
**Tamanhos**: `sm`, `md`, `lg`  
**Props**: `loading`, `disabled`, `fullWidth`

---

#### 📝 AppInputComponent
```html
<app-input
  label="Email"
  placeholder="seu@email.com"
  inputType="email"
  formControlName="email"
  [errors]="getFieldErrors('email')"
  [showCharCount]="true"
  required
></app-input>
```

**Tipos**: `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `time`  
**Features**: 
- ✅ Validação com mensagens de erro
- ✅ Toggle de visibilidade para password
- ✅ Contador de caracteres
- ✅ Ícones opcionais
- ✅ ReactiveFormsModule integrado

---

#### 🔐 LoginComponent
```typescript
// Email: demo@rotinik.com
// Password: password123
```

**Features**:
- Validação de email e senha
- Remember me checkbox
- Forgot password link
- Social login buttons (GitHub, Google)
- Loading states
- Error handling

---

#### 📝 RegisterComponent

**Features**:
- Validação de força de senha
- Confirmação de senha automática
- Termos and conditions obrigatórios
- Validadores customizados
- Social signup

---

## 🎨 Design System

### Tokens Disponíveis

#### Cores
```scss
// Backgrounds
--bg-app: #0a0e27;              // Dark navy
--bg-card: #131829;             // Cards
--bg-input: #1a1f3a;            // Inputs

// Brand
--brand-neon: #00ff88;          // Accent principal
--brand-gradient: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
--brand-muted: #4a5f8f;         // Borders

// Status
--game-success: #00ff88;
--game-danger: #ff4444;
--game-warning: #ffaa00;
```

#### Tipografia
```scss
--font-size-base: 1rem;         // 16px
--font-size-lg: 1.125rem;       // 18px
--font-size-2xl: 1.5rem;        // 24px
--font-size-3xl: 1.875rem;      // 30px
--font-size-4xl: 2.25rem;       // 36px

--font-semibold: 600;
--font-bold: 700;
```

#### Espaçamento
```scss
--spacing-2: 0.5rem;            // 8px
--spacing-3: 0.75rem;           // 12px
--spacing-4: 1rem;              // 16px
--spacing-5: 1.25rem;           // 20px
--spacing-6: 1.5rem;            // 24px
--spacing-8: 2rem;              // 32px
```

#### Arredondamentos
```scss
--radius-sm: 0.5rem;            // 8px
--radius-card: 1rem;            // 16px
--radius-pill: 9999px;          // Pílula (inputs)
```

---

## 🎯 Validadores Customizados

### Disponíveis em `src/app/shared/utils/validators.ts`

```typescript
// Força de senha (maiúsculas, minúsculas, números, símbolos)
passwordStrengthValidator()

// Verificar se as senhas correspondem
passwordMatchValidator('password', 'confirmPassword')

// Email rigoroso
emailValidator()

// Username (letras, números, -, _)
usernameValidator()

// URL válida
urlValidator()

// Telefone
phoneValidator()

// Email disponível (async simulation)
emailAvailabilityValidator()
```

---

## 🛠️ Utilitários Disponíveis

### Formatação
```typescript
import { 
  formatCurrency, 
  formatNumber, 
  formatTime, 
  formatDate, 
  formatRelativeTime,
  truncate,
  capitalize,
  titleCase
} from '@shared/utils/helpers';

formatCurrency(1000, 'BRL');        // R$ 1.000,00
formatNumber(1000);                  // 1.000
formatTime(3661000);                // 1h 1m 1s
formatDate(new Date());         // 31 de março de 2026
formatRelativeTime(new Date());      // agora
truncate('Long text...', 10);    // Long te...
capitalize('hello');                // Hello
titleCase('hello world');           // Hello World
```

### Utilitários de Objetos
```typescript
generateUuid()              // Gera UUID
deepClone(obj)              // Clone profundo
mergeObjects(target, source) // Mescla objetos
cleanObject(obj)            // Remove null/undefined
sortBy(array, key, 'asc')   // Ordena array
groupBy(array, key)         // Agrupa array
```

### Validações
```typescript
isValidEmail(email)          // Valida email
isValidUrl(url)             // Valida URL
isBetween(5, 1, 10)         // 5 está entre 1 e 10?
clamp(15, 1, 10)            // Limita entre 1 e 10 (retorna 10)
```

---

## 📱 Responsividade

### Breakpoints
```scss
--breakpoint-xs: 320px;     // Phones
--breakpoint-sm: 480px;     // Small phones
--breakpoint-md: 768px;     // Tablets (aqui começa media query)
--breakpoint-lg: 1024px;    // Laptops
--breakpoint-xl: 1280px;    // Desktops
--breakpoint-2xl: 1536px;   // Large desktops
```

### Exemplo de Media Query
```scss
@media (max-width: 480px) {
  // Mobile styles
}

@media (min-width: 768px) {
  // Tablet and up
}
```

---

## ♿ Acessibilidade

Implementado WCAG 2.1 Level A:

- ✅ Focus visible states
- ✅ ARIA labels e roles
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Color contrast ratios (WCAG AA)

---

## 🔄 Angular 17+ Patterns

### Standalone Components
```typescript
@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
  styleUrl: './component.scss',
})
export class MyComponent {}
```

### Signals para Reatividade
```typescript
// State
isLoading = signal(false);

// Computed
hasError = computed(() => {
  return this.errors && Object.keys(this.errors).length > 0;
});

// Update
this.isLoading.set(true);
this.isLoading.update(v => !v);
```

### Dependency Injection Funcional
```typescript
private fb = inject(FormBuilder);
private router = inject(Router);
```

### Reactive Forms
```typescript
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
}, { validators: passwordMatchValidator });
```

---

## 📊 Estrutura de Pastas

```
src/
├── index.html
├── main.ts
├── styles.scss                    # Design System Global
├── app/
│   ├── app.component.ts          # Root
│   ├── app.routes.ts             # Routing
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── button/
│   │   │       └── input/        # NEW ✨
│   │   └── utils/
│   │       ├── validators.ts     # NEW ✨
│   │       ├── helpers.ts        # NEW ✨
│   │       └── constants.ts      # NEW ✨
│   │
│   └── features/
│       ├── auth/
│       │   ├── login/            # NEW ✨
│       │   └── register/         # NEW ✨
│       └── home/                 # NEW ✨
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── [Config files]
    ├── angular.json
    ├── tsconfig.json
    ├── package.json
    └── .gitignore
```

---

## 🧪 Testando Componentes

### Login Test
```
Email: demo@rotinik.com
Senha: password123
```

Qualquer outra combinação retornará erro.

### Register Test
```
Nome: João Silva
Email: joao@example.com
Senha: Password123! (requer maiúscula, minúscula, número, símbolo)
Confirmação: Password123!
Termos: ✓
```

### Input Validation Test
```
Email: teste@email.com (válido)
Senha: abc123! (força mínima)
Confirmação: abc123! (deve corresponder)
```

---

## 📦 Dependências

```json
{
  "@angular/animations": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/compiler": "^17.0.0",
  "@angular/core": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/platform-browser": "^17.0.0",
  "@angular/platform-browser-dynamic": "^17.0.0",
  "@angular/router": "^17.0.0",
  "rxjs": "^7.8.0"
}
```

---

## 🔨 Scripts Disponíveis

```bash
# Development
npm start                # Inicia dev server
ng serve               # Alternative
ng serve --open        # Abre no browser

# Build
npm run build          # Build para produção
ng build --configuration production

# Testing
npm test              # Roda testes
ng test

# Linting & Formatting
npm run lint          # Lint
npm run format        # Prettier format
npm run format:check  # Verifica formato
```

---

## 🎯 Próximas Features (Sprint 2)

- [ ] GamificationService
- [ ] RoutineService
- [ ] CardComponent
- [ ] ModalComponent
- [ ] Toasts/Notifications
- [ ] Dashboard com rotinas
- [ ] CRUD de rotinas
- [ ] Integração com backend
- [ ] HTTP interceptors
- [ ] Auth guards
- [ ] Social features
- [ ] Leaderboard

---

## 💡 Best Practices

### Componentes
- ✅ Sempre use `standalone: true`
- ✅ Use `CommonModule` para diretivas
- ✅ Prefira `inject()` ao invés de constructor
- ✅ Use `Signals` para estado local
- ✅ Use `Computed` para valores derivados

### Estilos
- ✅ Use variáveis CSS do Design System
- ✅ Sempre use `var(--spacing-*)` para espaçamento
- ✅ Sempre use `var(--radius-*)` para arredondamentos
- ✅ Use mixins SCSS para código reutilizável
- ✅ Mobile-first approach

### Validação
- ✅ Use validadores padrão do Angular
- ✅ Adicione validadores customizados em `utils/validators.ts`
- ✅ Labels com asterisco (*) para campos obrigatórios
- ✅ Mensagens de erro customizadas

### UX/Acessibilidade
- ✅ Sempre adicione `aria-label` em inputs
- ✅ Use `role="alert"` em mensagens de erro
- ✅ Estados focus visível em todos os elementos
- ✅ Text contrast ratio mínimo 4.5:1
- ✅ Suporte a keyboard navigation

---

## 📞 Suporte e Referências

### Documentação Interna
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - Padrões detalhados
- 🚀 [QUICK_START.md](./QUICK_START.md) - Setup passo a passo
- 📋 [SPRINT_1_FASE_2.md](./SPRINT_1_FASE_2.md) - Sprint details

### Links Úteis
- [Angular Documentation](https://angular.io/docs)
- [Angular Standalone API](https://angular.io/guide/standalone-components)
- [Angular Signals](https://angular.io/guide/signals)
- [SCSS Documentation](https://sass-lang.com/documentation)

---

## 📝 Changelog

### Sprint 1 - Fase 2 (Atual)
- ✅ InputComponent criado com validação
- ✅ LoginComponent com formulário reativo
- ✅ RegisterComponent com validadores customizados
- ✅ Design System global em SCSS
- ✅ Validadores customizados em `utils/`
- ✅ Helpers e utilities
- ✅ Constants centralizadas
- ✅ HomeComponent placeholder
- ✅ Rotas configuradas
- ✅ Documentação completa

---

## 🎉 Status

**Sprint 1 - Fase 2: COMPLETA ✅**

Todos os requisitos implementados:
- ✅ InputComponent com design gamificado
- ✅ LoginComponent funcional
- ✅ RegisterComponent com validação
- ✅ Design System Dark/Gamificado
- ✅ Padrões Angular 17+
- ✅ Documentação e exemplos

Pronto para integração com backend na próxima sprint!

---

**Desenvolvido com ❤️ para Rotinik**

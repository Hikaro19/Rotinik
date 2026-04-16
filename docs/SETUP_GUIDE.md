# 🚀 Setup Guide - Rotinik Frontend

## Requisitos de Sistema

- **Node.js**: v18.x ou superior
- **npm**: v9.x ou superior
- **Angular CLI**: v17.x ou superior
- **Editor**: VS Code (recomendado)

### Verificar Versões

```bash
node --version       # v18.x.x
npm --version        # v9.x.x
ng version           # @angular/cli: 17.x.x
```

---

## 1️⃣ Instalação Inicial

### Clonar o Repositório

```bash
git clone <repository-url>
cd rotinik
```

### Instalar Dependências

```bash
npm install
```

Aguarde a instalação completar (pode levar alguns minutos).

---

## 2️⃣ Configuração de Ambiente

### Dev Environment

Configuração automática em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api',
  signalRUrl: 'http://localhost:5000/hubs/gamification',
  enableMockData: true,
};
```

### Prod Environment

Arquivo `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.rotinik.com/api',
  signalRUrl: 'https://api.rotinik.com/hubs/gamification',
  enableMockData: false,
};
```

---

## 3️⃣ Iniciar Servidor de Desenvolvimento

### Opção 1: npm script (recomendado)

```bash
npm start
```

Abre automaticamente `http://localhost:4200` no seu browser.

### Opção 2: Angular CLI

```bash
ng serve --open
```

### Opção 3: Sem abrir browser

```bash
ng serve
```

Acesse `http://localhost:4200` manualmente.

---

## 4️⃣ Testar a Aplicação

### Rota de Login

**URL**: `http://localhost:4200/auth/login`

**Demo Credentials**:
```
Email: demo@rotinik.com
Senha: password123
```

### Rota de Registro

**URL**: `http://localhost:4200/auth/register`

Preencha o formulário com dados válidos:
- Nome: Mínimo 3 caracteres
- Email: Formato válido
- Senha: Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo
- Confirmar: Deve ser igual à senha
- Termos: Deve aceitar

### Home (Dashboard)

**URL**: `http://localhost:4200/home`

Dashboard placeholder com estatísticas básicas.

---

## 5️⃣ Desenvolvimento

### Editor Recomendado: VS Code

#### Extensões Recomendadas

```bash
# Instale as seguintes extensões:
- Angular Language Service (Angular)
- SCSS IntelliSense (Wix)
- Prettier - Code formatter (esbenp.prettier-vscode)
- ESLint (dbaeumer.vscode-eslint)
- Thunder Client (rangav.vscode-thunder-client)
- Better Comments (aaron-bond.better-comments)
```

#### Workspace Settings (`.vscode/settings.json`)

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.formatOnPaste": true,
  "editor.wordWrap": "on"
}
```

---

## 6️⃣ Scripts Disponíveis

### Desenvolvimento

```bash
npm start                   # Inicia dev server com live reload
ng serve                   # Alternative
ng serve --open            # Abre no browser
ng serve --host 0.0.0.0    # Acessa de máquinas/dispositivos na rede
```

### Build

```bash
npm run build              # Build para desenvolvimento
npm run build:prod         # Build otimizado para produção
ng build --watch           # Watch mode
```

### Qualidade de Código

```bash
npm run lint               # Verifica ESLint
npm run format             # Formata com Prettier
npm run format:check       # Verifica se está formatado
```

### Testes

```bash
npm test                   # Roda testes com Karma
ng test --watch            # Watch mode
ng test --code-coverage    # Com relatório de cobertura
```

---

## 7️⃣ Estrutura de Pastas

```
rotinik/
├── src/
│   ├── index.html                    # HTML principal
│   ├── main.ts                       # Entry point
│   ├── styles.scss                   # Design System global
│   │
│   ├── app/
│   │   ├── app.component.ts          # Root component
│   │   ├── app.routes.ts             # Rotas principais
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── ui/
│   │   │   │       ├── button/       # Componente Button
│   │   │   │       └── input/        # Componente Input ✨
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── validators.ts     # Validadores customizados
│   │   │       ├── helpers.ts        # Funções auxiliares
│   │   │       └── constants.ts      # Constantes
│   │   │
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── login/            # Login page ✨
│   │       │   └── register/         # Register page ✨
│   │       └── home/                 # Home (dashboard) ✨
│   │
│   └── environments/
│       ├── environment.ts            # Config dev
│       └── environment.prod.ts       # Config prod
│
├── angular.json                      # Angular CLI config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependências
├── .editorconfig                     # Editor config
├── .prettierrc                       # Prettier config
├── .gitignore                        # Git ignore
│
└── [Documentação]
    ├── README.md                     # Este arquivo
    ├── ARCHITECTURE.md               # Padrões e design
    ├── QUICK_START.md                # Start rápido
    └── SPRINT_1_FASE_2.md           # Sprint details
```

---

## 8️⃣ Padrões de Desenvolvimento

### Componentes Standalone

Todos os novos componentes devem usar `standalone: true`:

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
  styleUrl: './my-component.scss',
})
export class MyComponent {}
```

### Injeção de Dependências

Prefira `inject()` funcional:

```typescript
private fb = inject(FormBuilder);
private router = inject(Router);
```

### Signals para State

Use Signals para estado local em componentes:

```typescript
isLoading = signal(false);
hasError = computed(() => !!this.errors());

// Atualizar
this.isLoading.set(true);
this.isLoading.update(v => !v);
```

### Reactive Forms

Use `FormBuilder` para formulários:

```typescript
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});
```

### Estilos

Use variáveis CSS do Design System:

```scss
.my-element {
  background: var(--bg-card);
  color: var(--text-title);
  padding: var(--spacing-4);
  border-radius: var(--radius-card);
}
```

---

## 9️⃣ Debugging

### Chrome DevTools

1. Abra `http://localhost:4200`
2. Pressione `F12` para abrir DevTools
3. Vá para aba **Elements** para inspecionar
4. Vá para aba **Console** para logs

### Angular DevTools Extension

Instale a extensão para Chrome:
- [Angular DevTools](https://chrome.google.com/webstore)

### VS Code Debugger

Arquivo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true,
      "preLaunchTask": "ng serve"
    }
  ]
}
```

---

## 🔟 Troubleshooting

### Porta 4200 em uso

```bash
# Usar outra porta
ng serve --port 4201

# Ou matar processo na porta
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4200
kill -9 <PID>
```

### Cache do npm problemático

```bash
npm cache clean --force
npm install
```

### Angular CLI não encontrado

```bash
npm install -g @angular/cli@17
```

### Dependências de build não instaladas

```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload não funcionando

```bash
# Reinicie o servidor
ng serve --poll 2000
```

---

## 1️⃣1️⃣ Deploy

### Build para Produção

```bash
npm run build:prod
```

Saída em `dist/rotinik/`

### Servir Build Localmente

```bash
npm install -g http-server
http-server dist/rotinik -p 8080 -g
```

### Deploy para Hosting

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Firebase
```bash
npm install -g firebase-tools
firebase deploy
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/rotinik
```

---

## 1️⃣2️⃣ CI/CD (Opcional)

### GitHub Actions

Arquivo `.github/workflows/build.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build:prod
      - run: npm test -- --watch=false --code-coverage
```

---

## 1️⃣3️⃣ Performance

### Bundle Size

```bash
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/rotinik/stats.json
```

### Lighthouse

```bash
# Via Chrome DevTools (F12 > Lighthouse)
# Ou via CLI:
npm install -g lighthouse
lighthouse http://localhost:4200
```

---

## 1️⃣4️⃣ Atualizações

### Angular

```bash
ng update @angular/cli @angular/core
```

### Dependências

```bash
npm outdated                    # Mostra versões desatualizadas
npm update                      # Atualiza tudo
npm audit fix                   # Fixa vulnerabilidades
```

---

## 📞 Suporte

- 📖 Consulte [README.md](./README.md)
- 📋 Veja [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🚀 Siga [QUICK_START.md](./QUICK_START.md)

---

**Bem-vindo ao Rotinik! 🎮**

Qualquer dúvida, consulte a documentação ou abra uma issue.

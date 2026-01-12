# 📱 Projeto PM - Gestão de Tarefas

## 📖 Sobre o Projeto

**Projeto PM** é uma aplicação móvel de gestão de tarefas desenvolvida com Ionic + Angular. A aplicação permite organizar projetos, categorias e tarefas de forma eficiente, incluindo um calendário integrado com feriados nacionais e sistema de notificações.

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
Projeto_PM/
├── src/
│   ├── app/
│   │   ├── home/              # Página inicial
│   │   ├── categorias/        # Gestão de categorias
│   │   ├── projetos/          # Gestão de projetos
│   │   ├── tarefas/           # Gestão de tarefas
│   │   ├── calendario/        # Visualização em calendário
│   │   ├── models/            # Interfaces TypeScript
│   │   ├── services/          # Serviços (lógica de negócio)
│   │   └── app.module.ts      # Módulo principal
│   ├── assets/                # Recursos estáticos
│   ├── theme/                 # Estilos e animações
│   └── global.scss            # Estilos globais
├── android/                   # Projeto Android nativo
├── resources/                 # Ícones e splash screens
└── www/                       # Build de produção
```

### Padrão Arquitetural

A aplicação segue o padrão **MVC (Model-View-Controller)** adaptado para Angular:

- **Models** (`src/app/models/`): Interfaces TypeScript que definem a estrutura dos dados
- **Views** (`src/app/*/**.page.html`): Templates HTML das páginas
- **Controllers** (`src/app/*/**.page.ts`): Lógica de apresentação e interação
- **Services** (`src/app/services/`): Lógica de negócio e acesso a dados

### Fluxo de Dados

1. **Armazenamento Local**: Utiliza `@ionic/storage-angular` para persistência local
2. **Services**: Cada entidade (Categoria, Projeto, Tarefa) tem um service dedicado
3. **Components**: As páginas consomem os services para exibir e manipular dados
4. **API Externa**: Integração com Nager.Date API para feriados nacionais

---

## 🛠️ Tecnologias Utilizadas

### Framework e Core

- **Ionic 8** - Framework para desenvolvimento de aplicações móveis híbridas
- **Angular 20** - Framework web para construção da interface
- **TypeScript 5.9** - Linguagem de programação tipada
- **Capacitor 8** - Runtime nativo para Android/iOS

### UI e Design

- **Ionicons 7** - Biblioteca de ícones
- **Google Fonts (Outfit)** - Fonte customizada
- **SCSS** - Pré-processador CSS para estilos
- **Animações CSS** - Transições e micro-interações

### Armazenamento e Dados

- **@ionic/storage-angular 4** - Armazenamento local (IndexedDB/LocalStorage)
- **localforage** - Wrapper para storage assíncrono

### APIs e Integrações

- **Nager.Date API** - API pública para feriados nacionais (Portugal)
- **HTTP Client** - Comunicação com APIs externas

### Plugins Capacitor

- **@capacitor/app** - Controlo do ciclo de vida da app
- **@capacitor/local-notifications** - Notificações locais
- **@capacitor/screen-orientation** - Controlo de orientação
- **@capacitor/status-bar** - Controlo da barra de estado
- **@capacitor/haptics** - Feedback háptico
- **@capacitor/keyboard** - Controlo do teclado

### Ferramentas de Desenvolvimento

- **Angular CLI** - Ferramentas de linha de comando
- **Ionic CLI** - CLI do Ionic
- **Capacitor CLI** - CLI do Capacitor
- **cordova-res** - Geração de recursos (ícones/splash)
- **ESLint** - Linter para qualidade de código
- **Karma/Jasmine** - Framework de testes

### Build e Deploy

- **Gradle** - Sistema de build para Android
- **Android Studio** - IDE para desenvolvimento Android
- **Node.js/npm** - Gestão de dependências

---

## 📦 Dependências Principais

### Runtime

```json
{
  "@ionic/angular": "^8.0.0",
  "@angular/core": "^20.0.0",
  "@capacitor/core": "8.0.0",
  "@ionic/storage-angular": "^4.0.0",
  "ionicons": "^7.0.0"
}
```

### Plugins Nativos

```json
{
  "@capacitor/android": "^8.0.0",
  "@capacitor/local-notifications": "^8.0.0",
  "@capacitor/screen-orientation": "^8.0.0"
}
```

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- **Node.js** 18+ e npm
- **Angular CLI** 20+
- **Ionic CLI** 7+
- **Android Studio** (para desenvolvimento Android)
- **Git** (para controlo de versão)

### Instalação

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/Projeto_PM.git
   cd Projeto_PM
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Executar em desenvolvimento:**
   ```bash
   npm start
   ```
   A aplicação estará disponível em `http://localhost:8100`

### Build para Produção

```bash
# Build web
npm run build

# Sincronizar com Android
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

### Gerar Recursos (Ícones/Splash)

```bash
npm run resources
```

---

## 📱 Funcionalidades

### ✅ Implementadas

- ✅ Gestão de **Categorias** (CRUD completo)
- ✅ Gestão de **Projetos** (CRUD completo)
- ✅ Gestão de **Tarefas** (CRUD completo)
- ✅ **Calendário** mensal com visualização de tarefas
- ✅ **Feriados nacionais** integrados via API
- ✅ **Notificações** para tarefas próximas
- ✅ **Filtros** por categoria
- ✅ **Ordenação** de tarefas
- ✅ **Badges dinâmicos** na página inicial
- ✅ **Animações** e transições suaves
- ✅ **Design responsivo** (mobile-first)
- ✅ **Ícones personalizados** e splash screen
- ✅ **Fontes customizadas**

### 🔄 Funcionalidades Futuras (Opcional)

- [ ] Pesquisa de tarefas
- [ ] Estatísticas e relatórios
- [ ] Exportação de dados
- [ ] Sincronização na nuvem
- [ ] Tema claro/escuro
- [ ] Modo offline completo

---

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com cobertura
npm run test -- --code-coverage
```

---

## 📚 Documentação

- **`MANUAL_UTILIZADOR.md`** - Manual completo do utilizador
- **`SETUP.md`** - Guia de configuração inicial
- **`GUIA_GIT.md`** - Referência de comandos Git
- **`GITHUB_WEB.md`** - Como usar GitHub via navegador

---

## 🏗️ Estrutura de Código

### Services

Cada service é responsável por uma entidade específica:

- **CategoriaService** - Gestão de categorias
- **ProjetoService** - Gestão de projetos
- **TarefaService** - Gestão de tarefas (inclui cálculo de atrasos)
- **FeriadoService** - Integração com API de feriados
- **NotificacaoService** - Gestão de notificações locais

### Models

Interfaces TypeScript que definem a estrutura dos dados:

- `Categoria` - { id: string, nome: string }
- `Projeto` - { id: string, nome: string, categoriaId: string }
- `Tarefa` - { id, titulo, descricao, dataLimite, projetoId, imagem?, emAtraso }

### Pages

Cada página segue a estrutura:

- `*.page.ts` - Lógica e controlo
- `*.page.html` - Template
- `*.page.scss` - Estilos específicos
- `*.module.ts` - Módulo Angular (lazy loading)

---

## 🔧 Scripts Disponíveis

```bash
npm start              # Servidor de desenvolvimento
npm run build          # Build de produção
npm test              # Executar testes
npm run lint          # Verificar código
npm run resources      # Gerar ícones e splash screens
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins académicos.

---

## 👥 Desenvolvimento

### Convenções de Código

- **TypeScript** com tipagem estrita
- **JSDoc** para documentação de funções
- **ESLint** para qualidade de código
- **Conventional Commits** para mensagens de commit

### Estrutura de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
style: alterações de estilo/UI
docs: documentação
refactor: refatoração de código
test: testes
```

---

## 🌐 APIs Externas

### Nager.Date API

- **URL Base**: `https://date.nager.at/api/v3`
- **Endpoint**: `/PublicHolidays/{year}/{countryCode}`
- **País**: PT (Portugal)
- **Uso**: Carregamento automático de feriados nacionais

---

## 📱 Plataformas Suportadas

- ✅ **Android** (testado e funcional)
- ⚠️ **iOS** (estrutura preparada, não testado)
- ✅ **Web** (navegador - desenvolvimento)

---

## 🐛 Problemas Conhecidos

- Alguns avisos do Gradle no build Android (não críticos)
- Requer ligação à Internet para carregar feriados na primeira vez

---

## 📞 Suporte

Para questões ou problemas:
1. Consulta o `MANUAL_UTILIZADOR.md`
2. Verifica os issues no GitHub
3. Contacta o desenvolvedor

---

**Versão:** 1.0  
**Última atualização:** 2024

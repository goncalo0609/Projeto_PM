# Projeto de Programação Móvel

## 📱 Sobre o Projeto

Este é o repositório para o trabalho de Programação Móvel.

## 🚀 Configuração Inicial

### 📖 Guias Disponíveis:

- **`SETUP.md`** - Guia passo a passo completo (RECOMENDADO para começar)
- **`GITHUB_WEB.md`** - Como usar o GitHub através do navegador web
- **`GUIA_GIT.md`** - Referência completa de comandos Git

### ⚡ Início Rápido:

1. **Criar repositório no GitHub** (WEB):
   - Acesse: https://github.com/new
   - Nome: `Projeto_PM`
   - Crie o repositório (sem marcar README, .gitignore, license)

2. **Instalar Git** (se não tiver):
   - Download: https://git-scm.com/download/win

3. **Configurar e conectar**:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@example.com"
   cd c:\Users\conta\Projeto_PM
   git init
   git remote add origin https://github.com/SEU_USUARIO/Projeto_PM.git
   git add .
   git commit -m "Initial commit: estrutura inicial do projeto"
   git branch -M main
   git push -u origin main
   ```

📚 **Para instruções detalhadas, veja `SETUP.md`**

## 📝 Como fazer commits durante o desenvolvimento

### Workflow básico:

1. **Ver o status dos ficheiros:**
```bash
git status
```

2. **Adicionar ficheiros ao staging:**
```bash
# Adicionar todos os ficheiros modificados
git add .

# Ou adicionar ficheiros específicos
git add nome_do_ficheiro.ext
```

3. **Fazer commit:**
```bash
git commit -m "Descrição clara do que foi feito"
```

Exemplos de mensagens de commit:
- `"feat: adicionar tela de login"`
- `"fix: corrigir erro na validação de email"`
- `"style: melhorar layout da tela principal"`
- `"docs: atualizar README com instruções de instalação"`

4. **Enviar para o GitHub:**
```bash
git push
```

## 🔄 Comandos úteis

- `git log` - Ver histórico de commits
- `git log --oneline` - Ver histórico resumido
- `git diff` - Ver diferenças não commitadas
- `git branch` - Listar branches
- `git checkout -b nome-da-branch` - Criar nova branch

## 📚 Estrutura do Projeto

(Esta seção será atualizada conforme o projeto for desenvolvido)

## 👥 Colaboradores

- Seu Nome

## 📚 Documentação Adicional

- **`SETUP.md`** - Configuração completa passo a passo
- **`GITHUB_WEB.md`** - Como usar o GitHub via navegador
- **`GUIA_GIT.md`** - Comandos Git e workflow de commits
- **`estrutura_projeto.txt`** - Estrutura recomendada do projeto

---

**Nota:** Lembre-se de fazer commits regulares e com mensagens descritivas para que o professor possa acompanhar o progresso do trabalho!

💡 **Dica**: Você pode visualizar e editar ficheiros diretamente no GitHub web! Veja `GITHUB_WEB.md` para mais informações.

# 🛠️ Guia de Setup Rápido - GitHub na Web

## 🌐 Método Recomendado: Criar Repositório no GitHub Primeiro

Este guia prioriza criar o repositório no GitHub via web primeiro, depois conectar ao seu computador.

### ⚡ Passo 1: Criar Conta no GitHub (se ainda não tiver)

1. Acesse: https://github.com/signup
2. Crie uma conta gratuita
3. Confirme o email que receberá

### ⚡ Passo 2: Criar Repositório no GitHub (WEB)

1. Faça login no GitHub: https://github.com/login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
   - Ou acesse diretamente: https://github.com/new
3. Preencha o formulário:
   - **Repository name**: `Projeto_PM` (ou outro nome de sua escolha)
   - **Description**: `Trabalho de Programação Móvel`
   - **Visibility**: 
     - ✅ **Public** - visível para todos (mais comum para trabalhos acadêmicos)
     - Ou **Private** - apenas você e colaboradores
   - ⚠️ **IMPORTANTE**: **NÃO marque** nenhuma opção:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   (Deixe tudo vazio porque já temos os ficheiros locais)
4. Clique em **"Create repository"** (botão verde)

### ⚡ Passo 3: Copiar URL do Repositório

Após criar, você verá uma página com instruções. **Copie a URL HTTPS** que aparece, algo como:
```
https://github.com/SEU_USUARIO/Projeto_PM.git
```

⚠️ **Guarde essa URL!** Você vai precisar dela.

### ⚡ Passo 4: Instalar Git no Seu Computador

1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador
3. Execute e instale (clique "Next" em tudo, padrões são suficientes)
4. **IMPORTANTE**: Reinicie o terminal/PowerShell após instalar

### ⚡ Passo 5: Verificar se Git Está Instalado

Abra PowerShell e digite:
```bash
git --version
```

Se aparecer algo como `git version 2.x.x`, está instalado! ✅

### ⚡ Passo 6: Configurar Git (primeira vez, substitua pelos seus dados)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

**Exemplo:**
```bash
git config --global user.name "João Silva"
git config --global user.email "joao.silva@email.com"
```

⚠️ **Use o mesmo email da sua conta GitHub!**

### ⚡ Passo 7: Navegar para a Pasta do Projeto

```bash
cd c:\Users\conta\Projeto_PM
```

### ⚡ Passo 8: Inicializar Git Localmente

```bash
git init
```

Você verá: `Initialized empty Git repository...` ✅

### ⚡ Passo 9: Conectar ao Repositório GitHub (use a URL que copiou)

```bash
git remote add origin https://github.com/SEU_USUARIO/Projeto_PM.git
```

(Substitua pela URL real que você copiou no Passo 3)

### ⚡ Passo 10: Primeiro Commit e Push

```bash
# Adicionar todos os ficheiros
git add .

# Ver o que será commitado (opcional mas recomendado)
git status

# Fazer o primeiro commit
git commit -m "Initial commit: estrutura inicial do projeto"

# Configurar branch principal como 'main'
git branch -M main

# Enviar para o GitHub (aqui vai pedir autenticação)
git push -u origin main
```

### ⚡ Passo 11: Autenticação (quando pedir)

Quando executar `git push`, o GitHub pedirá autenticação. Veja as opções abaixo.

### ✅ Pronto! Verificar no GitHub

1. Acesse seu repositório no navegador: `https://github.com/SEU_USUARIO/Projeto_PM`
2. Você deve ver todos os ficheiros que criamos (README.md, .gitignore, etc.)
3. O professor agora pode acompanhar seu progresso! 🎉

## 🔄 Próximos Passos

Agora que está configurado, para fazer commits durante o desenvolvimento:

```bash
git add .
git commit -m "feat: descrição do que foi feito"
git push
```

Consulte o arquivo `GUIA_GIT.md` para mais detalhes sobre commits!

## 🔐 Autenticação no GitHub

Quando você fizer `git push` pela primeira vez, o GitHub pode pedir login:

**Opção 1: Personal Access Token (recomendado)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Marque `repo` (todas as permissões)
4. Copie o token (você só verá uma vez!)
5. Use o token como senha quando pedir

**Opção 2: GitHub CLI (mais fácil)**
```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticar
gh auth login
```

## 🆘 Problemas?

### "git: command not found"
→ Git não está instalado ou precisa reiniciar o terminal

### "fatal: remote origin already exists"
→ Já foi configurado. Pode pular o Passo 9.

### "error: failed to push"
→ Verifique se a URL do remote está correta:
```bash
git remote -v
```

### Precisa de ajuda?
→ Consulte o arquivo `GUIA_GIT.md` para mais detalhes

---

**Boa sorte com o projeto! 🚀**

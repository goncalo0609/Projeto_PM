# 📘 Guia Completo de Git para o Projeto

Este guia contém todos os comandos que você precisará usar durante o desenvolvimento do projeto.

## 🎯 Setup Inicial (fazer apenas uma vez)

### 1. Verificar se Git está instalado
```bash
git --version
```

### 2. Configurar identidade (apenas primeira vez)
```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@example.com"
```

### 3. Inicializar repositório
```bash
cd c:\Users\conta\Projeto_PM
git init
```

### 4. Adicionar remote do GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/Projeto_PM.git
```

## 🔄 Workflow Diário de Commits

### Cenário 1: Você fez algumas alterações e quer commitar

```bash
# 1. Ver o que mudou
git status

# 2. Ver as diferenças específicas (opcional, mas útil)
git diff

# 3. Adicionar todos os ficheiros modificados
git add .

# 4. Fazer commit com mensagem descritiva
git commit -m "feat: implementar funcionalidade X"

# 5. Enviar para o GitHub
git push
```

### Cenário 2: Você quer adicionar apenas ficheiros específicos

```bash
# Ver status
git status

# Adicionar apenas um ficheiro
git add src/screens/LoginScreen.js

# Ou múltiplos ficheiros
git add src/screens/LoginScreen.js src/components/Button.js

# Commitar
git commit -m "feat: adicionar tela de login e componente de botão"

# Push
git push
```

### Cenário 3: Você quer ver o histórico antes de fazer push

```bash
# Ver últimos commits
git log --oneline -10

# Ver detalhes de um commit específico
git show HEAD

# Depois fazer push normalmente
git push
```

## 📝 Convenções de Mensagens de Commit

Use prefixos para facilitar a leitura:

- **feat:** Nova funcionalidade
  - `feat: adicionar tela de cadastro de usuário`
  - `feat: implementar autenticação com Firebase`

- **fix:** Correção de bugs
  - `fix: corrigir erro ao salvar dados`
  - `fix: resolver problema de validação de email`

- **style:** Alterações de formatação/estilo
  - `style: melhorar layout da tela principal`
  - `style: ajustar cores do tema`

- **refactor:** Refatoração de código
  - `refactor: reorganizar estrutura de pastas`
  - `refactor: simplificar função de validação`

- **docs:** Documentação
  - `docs: atualizar README com instruções`
  - `docs: adicionar comentários no código`

- **test:** Testes
  - `test: adicionar testes para componente Button`
  - `test: criar testes de integração`

- **chore:** Tarefas de manutenção
  - `chore: atualizar dependências`
  - `chore: configurar ESLint`

## 🚨 Solução de Problemas Comuns

### Erro: "fatal: not a git repository"
```bash
# Você precisa estar na pasta do projeto e ter inicializado o git
cd c:\Users\conta\Projeto_PM
git init
```

### Erro: "error: failed to push some refs"
```bash
# Alguém fez commits no GitHub. Você precisa fazer pull primeiro:
git pull origin main

# Se houver conflitos, resolva-os e depois:
git add .
git commit -m "merge: resolver conflitos"
git push
```

### Erro: "fatal: remote origin already exists"
```bash
# Ver remotes existentes
git remote -v

# Remover e adicionar novamente (se necessário)
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/Projeto_PM.git
```

### Desfazer último commit (mas manter alterações)
```bash
git reset --soft HEAD~1
```

### Desfazer alterações em um ficheiro específico
```bash
git checkout -- nome_do_ficheiro.js
```

### Ver histórico visual
```bash
git log --oneline --graph --all
```

## 📋 Checklist para Commits Profissionais

Antes de fazer commit, pergunte-se:

- [ ] Fiz alterações relacionadas? (um commit = uma funcionalidade/mudança)
- [ ] A mensagem está clara e descritiva?
- [ ] Adicionei apenas os ficheiros necessários?
- [ ] Testei que não quebrei nada?
- [ ] Removi console.logs e código comentado?

## 🎓 Exemplo de Sessão Completa

```bash
# Você desenvolveu uma nova tela de login

# 1. Ver o que mudou
git status

# 2. Adicionar os ficheiros da nova funcionalidade
git add src/screens/LoginScreen.js
git add src/components/LoginForm.js

# 3. Verificar se está tudo certo
git status

# 4. Commitar com mensagem descritiva
git commit -m "feat: implementar tela de login com validação de formulário"

# 5. Enviar para o GitHub
git push

# ✅ Commit realizado com sucesso!
```

## 💡 Dicas Profissionais

1. **Faça commits frequentes**: Não acumule muitas alterações. Commit pequeno e frequente é melhor!

2. **Commits atômicos**: Cada commit deve representar uma mudança completa e funcional.

3. **Mensagens claras**: O professor precisa entender o que foi feito só lendo a mensagem.

4. **Sempre faça `git status` primeiro**: Isso evita surpresas.

5. **Use `git diff` antes de commit**: Verifique se está committando o que realmente quer.

---

**Lembre-se:** Commits são o histórico do seu trabalho. Faça-os com cuidado e atenção! 🚀

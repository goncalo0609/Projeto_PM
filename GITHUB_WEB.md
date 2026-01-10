# 🌐 Guia Completo: Usando GitHub na Web

Este guia explica como usar o GitHub através do navegador web, mesmo após configurar tudo.

## 📋 O Que Você Pode Fazer no GitHub Web

### ✅ Visualizar Código
- Ver todos os seus ficheiros
- Ler código diretamente no navegador
- Ver histórico de commits
- Ver quem fez cada alteração

### ✅ Gerenciar Repositório
- Editar ficheiros diretamente (para pequenas correções)
- Criar pastas
- Apagar ficheiros
- Renomear ficheiros
- Ver diferenças entre versões

### ✅ Acompanhar Progresso
- Ver commits em ordem cronológica
- Ver gráficos de contribuição
- Ver quando cada alteração foi feita

## 🎯 Como Acessar Seu Repositório na Web

1. **Faça login**: https://github.com/login
2. **Veja seus repositórios**: https://github.com (aparecem na página inicial)
3. **Clique no repositório**: `Projeto_PM`
4. **URL direta**: `https://github.com/SEU_USUARIO/Projeto_PM`

## ✏️ Editar Ficheiros Diretamente no GitHub

### Para Fazer Pequenas Alterações:

1. Acesse seu repositório no GitHub
2. Navegue até o ficheiro que quer editar (ex: `README.md`)
3. Clique no ícone de **lápis** (✏️) no canto superior direito
4. Faça suas alterações
5. Role a página até o final
6. No campo **"Commit changes"**, escreva uma mensagem, exemplo:
   - `docs: atualizar informações do projeto`
7. Clique em **"Commit changes"** (botão verde)

⚠️ **Nota**: Para alterações grandes, é melhor editar localmente e fazer `git push`.

## 📁 Criar Novos Ficheiros no GitHub Web

1. No seu repositório, clique em **"Add file"** → **"Create new file"**
2. Digite o nome do ficheiro (ex: `src/App.js`)
3. Escreva o conteúdo
4. Role até o final
5. Escreva mensagem de commit
6. Clique em **"Commit new file"**

## 📂 Criar Pastas no GitHub Web

1. Clique em **"Add file"** → **"Create new file"**
2. Digite o nome da pasta + nome do ficheiro, exemplo:
   - `src/screens/HomeScreen.js`
3. GitHub cria a pasta automaticamente!
4. Escreva o conteúdo do ficheiro
5. Commit como acima

## 📊 Ver Histórico de Commits (Timeline)

1. No repositório, clique em **"Commits"** (ou na barra lateral)
2. Você verá todos os commits em ordem cronológica
3. Clique em um commit para ver o que mudou

## 🔍 Ver Diferenças Entre Versões

1. Clique em um commit específico
2. Você verá:
   - **Verde** = linhas adicionadas
   - **Vermelho** = linhas removidas
   - O que foi alterado em cada ficheiro

## 👀 Compartilhar com o Professor

Depois de fazer commits, você pode:

1. **Copiar a URL do repositório** e enviar ao professor
2. **Gerar link de release**: GitHub → Releases → Create a new release
3. **Mostrar commits específicos**: Compartilhe o link do commit

## 📱 Ver no Celular

O GitHub tem apps móveis:
- **Android**: Google Play Store → "GitHub"
- **iOS**: App Store → "GitHub"

Você pode ver commits, editar ficheiros e acompanhar o projeto pelo celular!

## 🔐 Configurações do Repositório

### Para Alterar Nome, Descrição, etc:

1. No repositório, clique em **"Settings"** (engrenagem)
2. Role até **"Repository name"** para renomear
3. Ou edite a descrição na página principal

### Para Adicionar Colaboradores:

1. Settings → **"Collaborators"** (menu lateral)
2. **"Add people"**
3. Digite o username GitHub do professor
4. Envie convite

## 🎨 Visualizar Código com Syntax Highlighting

- GitHub colore automaticamente o código
- Suporta todas as linguagens principais
- Clique num ficheiro `.js`, `.py`, `.java`, etc. para ver formatado

## 💡 Dicas Úteis

### Ver Estatísticas do Projeto:
- No repositório, clique em **"Insights"** → **"Contributors"**
- Veja gráficos de atividade

### Ver Todas as Branches:
- Clique em onde diz **"main"** (ou nome da branch)
- Veja todas as branches do projeto

### Buscar no Código:
- Pressione **`T`** no repositório
- Busque por palavras-chave no código
- Muito útil para projetos grandes!

### Ver Ficheiros Ocultos (.gitignore, etc):
- GitHub mostra ficheiros que começam com ponto
- Basta clicar no nome do ficheiro

## 🆘 Problemas Comuns

### "Não consigo ver meus commits"
→ Verifique se fez `git push` depois de `git commit`

### "Quero desfazer uma alteração feita na web"
→ Faça outra edição ou use Git localmente com `git revert`

### "Não aparece o botão de editar"
→ Verifique se está logado e tem permissão no repositório

## 🎓 Exemplo Prático: Primeira Edição no GitHub Web

Vamos atualizar o README.md:

1. Acesse: `https://github.com/SEU_USUARIO/Projeto_PM`
2. Clique em `README.md`
3. Clique no lápis (✏️)
4. Adicione uma linha, exemplo:
   ```
   ## 🚀 Status do Projeto
   - [x] Configuração inicial do repositório
   - [ ] Implementar primeira funcionalidade
   ```
5. Role até o final
6. Escreva: `docs: adicionar checklist de progresso`
7. Clique **"Commit changes"**
8. ✅ Pronto! Agora você vê o commit no histórico!

---

**Lembre-se**: O GitHub web é ótimo para visualizar e fazer pequenas edições. Para desenvolvimento maior, use Git localmente! 🚀

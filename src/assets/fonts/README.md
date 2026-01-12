# Fontes Customizadas

Esta pasta contém os ficheiros de fontes customizadas da aplicação.

## Formatos Suportados

A aplicação suporta os seguintes formatos de fonte:
- **WOFF2** (recomendado - melhor compressão e suporte moderno)
- **WOFF** (fallback para navegadores mais antigos)
- **TTF/OTF** (fallback adicional)

## Como Adicionar Fontes

1. **Baixar/Obter os ficheiros de fonte:**
   - Recomendado: usar fontes de [Google Fonts](https://fonts.google.com/), [Font Squirrel](https://www.fontsquirrel.com/), ou outras fontes gratuitas
   - Certifica-te de que tens os direitos para usar a fonte

2. **Colocar os ficheiros nesta pasta:**
   - Coloca todos os ficheiros da fonte (normal, bold, italic, etc.) nesta pasta
   - Exemplo: `Roboto-Regular.woff2`, `Roboto-Bold.woff2`, `Roboto-Italic.woff2`

3. **Registar a fonte no `global.scss`:**
   - Adiciona um `@font-face` para cada variante da fonte
   - Exemplo:
   ```scss
   @font-face {
     font-family: 'Roboto';
     src: url('./assets/fonts/Roboto-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
   }
   ```

4. **Usar a fonte na aplicação:**
   - A fonte será aplicada automaticamente se estiver definida em `global.scss`
   - Ou podes usar diretamente com `font-family: 'NomeDaFonte'`

## Exemplos de Fontes Populares

- **Roboto** - Moderna e legível (Google Fonts)
- **Open Sans** - Limpa e profissional (Google Fonts)
- **Inter** - Otimizada para interfaces (Google Fonts)
- **Poppins** - Geometric e moderna (Google Fonts)
- **Montserrat** - Elegante e versátil (Google Fonts)

## Notas

- Use WOFF2 sempre que possível (melhor compressão)
- Inclua fallbacks (WOFF, TTF) para compatibilidade
- Teste a legibilidade em diferentes tamanhos de ecrã
- Considere o peso da fonte (performance)

# Exemplo: Como Usar Fontes do Google Fonts

## Método 1: Download Manual (Recomendado para produção)

1. **Aceder ao Google Fonts:**
   - Vai a [fonts.google.com](https://fonts.google.com/)
   - Escolhe uma fonte (ex: Roboto, Open Sans, Inter, Poppins)

2. **Baixar a fonte:**
   - Clica na fonte escolhida
   - Clica em "Download family"
   - Extrai o ficheiro ZIP

3. **Converter para WOFF2 (opcional mas recomendado):**
   - Usa [CloudConvert](https://cloudconvert.com/) ou [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
   - Converte os ficheiros TTF para WOFF2 e WOFF

4. **Colocar os ficheiros:**
   - Copia os ficheiros WOFF2/WOFF para `src/assets/fonts/`
   - Exemplo: `Roboto-Regular.woff2`, `Roboto-Bold.woff2`

5. **Atualizar `global.scss`:**
   - Substitui `'CustomFont'` pelo nome da tua fonte
   - Atualiza os caminhos dos ficheiros
   - Exemplo:
   ```scss
   @font-face {
     font-family: 'Roboto';
     src: url('./assets/fonts/Roboto-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

## Método 2: Via CDN (Mais rápido, mas depende de internet)

Se preferires usar diretamente do Google Fonts via CDN:

1. **Adicionar no `index.html`:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
   ```

2. **Atualizar `global.scss`:**
   ```scss
   html {
     font-family: 'Roboto', sans-serif;
   }
   ```

**Nota:** O Método 1 é melhor para produção (fontes locais, mais rápido, funciona offline). O Método 2 é mais rápido de configurar mas depende de internet.

# Recursos de Ícone e Splash Screen

Esta pasta contém os ficheiros fonte para gerar os ícones e splash screens da aplicação.

## Ficheiros necessários

Coloque os seguintes ficheiros nesta pasta:

### `icon.png`
- **Dimensões**: 1024×1024 pixels (mínimo)
- **Formato**: PNG
- **Recomendação**: Imagem quadrada, fundo transparente ou sólido
- **Uso**: Ícone da aplicação que aparece no dispositivo

### `splash.png`
- **Dimensões**: 2732×2732 pixels (mínimo)
- **Formato**: PNG
- **Recomendação**: Imagem quadrada, pode incluir logo e texto
- **Uso**: Tela de splash (tela inicial) que aparece ao abrir a aplicação

## Como gerar os recursos

Após adicionar os ficheiros `icon.png` e `splash.png` nesta pasta, execute:

```bash
npm run resources
```

Este comando irá gerar automaticamente todos os tamanhos necessários para as diferentes plataformas (iOS, Android, Web).

## Notas

- As imagens devem ser de alta qualidade
- Para o ícone, evite texto pequeno (pode não ser legível em tamanhos pequenos)
- Para o splash screen, mantenha elementos importantes no centro (podem ser cortados em alguns dispositivos)

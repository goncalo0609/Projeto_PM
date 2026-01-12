const fs = require('fs');
const path = require('path');

// Criar pastas se não existirem
const iconDir = path.join(__dirname, '..', 'src', 'assets', 'icon');
const splashDir = path.join(__dirname, '..', 'src', 'assets', 'splash');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

// Copiar apenas os ficheiros originais (icon.png e splash.png)
const iconSource = path.join(__dirname, '..', 'resources', 'icon.png');
const iconDest = path.join(iconDir, 'icon.png');
if (fs.existsSync(iconSource)) {
  fs.copyFileSync(iconSource, iconDest);
  console.log('✓ icon.png copiado');
}

const splashSource = path.join(__dirname, '..', 'resources', 'splash.png');
const splashDest = path.join(splashDir, 'splash.png');
if (fs.existsSync(splashSource)) {
  fs.copyFileSync(splashSource, splashDest);
  console.log('✓ splash.png copiado');
}

console.log('✓ Recursos originais copiados para src/assets/');

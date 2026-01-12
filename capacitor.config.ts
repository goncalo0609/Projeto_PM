import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuração do Capacitor
 * Define as configurações base da aplicação para compilação nativa (Android/iOS)
 */
const config: CapacitorConfig = {
  /** ID único da aplicação (formato: reverse domain) */
  appId: 'io.ionic.projetopm',
  /** Nome da aplicação exibido no dispositivo */
  appName: 'Projeto PM',
  /** Diretório onde os ficheiros web compilados são gerados */
  webDir: 'www'
};

export default config;

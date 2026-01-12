import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

/**
 * Componente raiz da aplicação
 * Responsável pela inicialização global, incluindo controlo de orientação
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor() {}

  /**
   * Inicializa a aplicação
   * Configura a orientação do ecrã para portrait (vertical)
   */
  async ngOnInit() {
    // Bloqueia a orientação em portrait apenas em dispositivos nativos (iOS/Android)
    // No navegador web, não aplica restrições
    if (Capacitor.isNativePlatform()) {
      try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
      } catch (error) {
        // Em caso de erro (ex: plugin não disponível), apenas registra o erro
        // Não bloqueia a inicialização da aplicação
        console.warn('Erro ao bloquear orientação:', error);
      }
    }
  }
}

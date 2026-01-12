import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { NotificacaoService } from './services/notificacao.service';

/**
 * Componente raiz da aplicação
 * Responsável pela inicialização global, incluindo controlo de orientação e notificações
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private notificacaoService: NotificacaoService) {}

  /**
   * Inicializa a aplicação
   * Configura a orientação do ecrã para portrait (vertical)
   * Agenda notificações para tarefas próximas
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

    // Agenda notificações para tarefas próximas
    // Aguarda um pequeno delay para garantir que os services estão inicializados
    setTimeout(async () => {
      try {
        await this.notificacaoService.agendarNotificacoesTarefasProximas();
      } catch (error) {
        console.warn('Erro ao agendar notificações:', error);
      }
    }, 1000);
  }
}

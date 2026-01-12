import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Tarefa } from '../models/tarefa.model';
import { TarefaService } from './tarefa.service';

/**
 * Service responsável pela gestão de notificações locais
 * Agenda notificações para tarefas com data limite próxima
 */
@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private readonly DIAS_ANTECEDENCIA = 1; // Notificar 1 dia antes da data limite

  constructor(private tarefaService: TarefaService) {}

  /**
   * Solicita permissão para enviar notificações
   * @returns Promise<boolean> - true se a permissão foi concedida
   */
  async solicitarPermissao(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      // No navegador web, não é possível solicitar permissão
      return false;
    }

    try {
      const resultado = await LocalNotifications.requestPermissions();
      return resultado.display === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelarTodasNotificacoes(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Obtém todas as notificações pendentes
      const pendentes = await LocalNotifications.getPending();
      
      if (pendentes && pendentes.notifications && pendentes.notifications.length > 0) {
        // Extrai os IDs das notificações pendentes
        const ids = pendentes.notifications.map((notif: { id: number }) => notif.id);
        
        // Cancela todas as notificações pelos IDs
        await LocalNotifications.cancel({
          notifications: ids.map((id: number) => ({ id }))
        });
      }
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  }

  /**
   * Verifica se uma tarefa está próxima (dentro do prazo de antecedência)
   * @param dataLimite - Data limite da tarefa (formato ISO string)
   * @returns boolean - true se a tarefa está próxima
   */
  private tarefaEstaProxima(dataLimite: string): boolean {
    try {
      const dataLimiteObj = new Date(dataLimite);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + this.DIAS_ANTECEDENCIA);

      dataLimiteObj.setHours(0, 0, 0, 0);

      // Verifica se a data limite é hoje ou amanhã
      return dataLimiteObj >= hoje && dataLimiteObj <= amanha;
    } catch (error) {
      console.error('Erro ao verificar se tarefa está próxima:', error);
      return false;
    }
  }

  /**
   * Agenda notificações para todas as tarefas próximas
   */
  async agendarNotificacoesTarefasProximas(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // No navegador web, não agendar notificações
      return;
    }

    try {
      // Verifica permissão
      const temPermissao = await this.solicitarPermissao();
      if (!temPermissao) {
        console.warn('Permissão de notificações não concedida');
        return;
      }

      // Cancela notificações antigas
      await this.cancelarTodasNotificacoes();

      // Obtém todas as tarefas
      const tarefas = await this.tarefaService.getAll();

      // Filtra tarefas próximas
      const tarefasProximas = tarefas.filter((tarefa: Tarefa) => 
        this.tarefaEstaProxima(tarefa.dataLimite)
      );

      if (tarefasProximas.length === 0) {
        return;
      }

      // Agenda notificações
      const notificacoes = tarefasProximas.map((tarefa: Tarefa, index: number) => {
        const dataLimite = new Date(tarefa.dataLimite);
        const hoje = new Date();

        // Se a tarefa é para hoje, agenda para 9h da manhã
        // Se é para amanhã, agenda para 9h da manhã de amanhã
        const horaNotificacao = new Date(dataLimite);
        horaNotificacao.setHours(9, 0, 0, 0);

        // Se a hora já passou hoje, agenda para amanhã
        if (horaNotificacao <= hoje) {
          horaNotificacao.setDate(horaNotificacao.getDate() + 1);
        }

        const mensagem = tarefa.emAtraso 
          ? `⚠️ Tarefa em atraso: ${tarefa.titulo}`
          : `📋 Lembrete: ${tarefa.titulo} - Data limite: ${this.formatarData(dataLimite)}`;

        return {
          title: 'Tarefa Próxima',
          body: mensagem,
          id: index + 1, // IDs únicos começando em 1
          schedule: {
            at: horaNotificacao
          }
        };
      });

      await LocalNotifications.schedule({
        notifications: notificacoes
      });

      console.log(`${notificacoes.length} notificação(ões) agendada(s)`);
    } catch (error) {
      console.error('Erro ao agendar notificações:', error);
    }
  }

  /**
   * Formata uma data para exibição
   * @param data - Data a formatar
   * @returns string - Data formatada (dd/mm/yyyy)
   */
  private formatarData(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Agenda notificações quando uma tarefa é criada ou atualizada
   * @param tarefa - Tarefa criada ou atualizada
   */
  async atualizarNotificacaoTarefa(tarefa: Tarefa): Promise<void> {
    // Recria todas as notificações para garantir consistência
    await this.agendarNotificacoesTarefasProximas();
  }
}

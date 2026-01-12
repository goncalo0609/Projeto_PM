import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { TarefaService } from '../services/tarefa.service';
import { ProjetoService } from '../services/projeto.service';
import { Tarefa } from '../models/tarefa.model';
import { Projeto } from '../models/projeto.model';

/**
 * Página de gestão de tarefas
 * Permite visualizar, adicionar, editar e eliminar tarefas
 */
@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.page.html',
  styleUrls: ['./tarefas.page.scss'],
  standalone: false,
})
export class TarefasPage implements OnInit {
  /** Array com todas as tarefas */
  tarefas: Tarefa[] = [];

  /** Array com todos os projetos */
  projetos: Projeto[] = [];

  /** Flag para indicar se está a carregar dados */
  carregando = false;

  constructor(
    private tarefaService: TarefaService,
    private projetoService: ProjetoService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  /**
   * Inicializa a página carregando as tarefas e projetos
   */
  async ngOnInit() {
    await this.carregarDados();
  }

  /**
   * Carrega tarefas e projetos
   */
  async carregarDados() {
    try {
      this.carregando = true;
      this.projetos = await this.projetoService.getAll();
      this.tarefas = await this.tarefaService.getAll();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.mostrarToast('Erro ao carregar tarefas', 'danger');
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Obtém o nome do projeto pelo ID
   * @param projetoId - ID do projeto
   * @returns string - Nome do projeto ou 'Sem projeto'
   */
  obterNomeProjeto(projetoId: string): string {
    const projeto = this.projetos.find(proj => proj.id === projetoId);
    return projeto ? projeto.nome : 'Sem projeto';
  }

  /**
   * Formata a data para exibição (DD/MM/YYYY)
   * @param dataLimite - Data em formato ISO string
   * @returns string - Data formatada
   */
  formatarData(dataLimite: string): string {
    try {
      const data = new Date(dataLimite);
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return dataLimite;
    }
  }

  /**
   * Abre um alert para adicionar uma nova tarefa
   */
  async adicionarTarefa() {
    if (this.projetos.length === 0) {
      await this.mostrarToast('Crie um projeto primeiro', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Nova Tarefa',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          placeholder: 'Título da tarefa',
          attributes: {
            maxlength: 100,
            required: true
          }
        },
        {
          name: 'descricao',
          type: 'text',
          placeholder: 'Descrição da tarefa (opcional)',
          attributes: {
            maxlength: 500
          }
        },
        {
          name: 'dataLimite',
          type: 'date',
          placeholder: 'Data limite',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: async (data) => {
            if (data.titulo && data.titulo.trim() && data.dataLimite) {
              // Converte a data para formato ISO
              const dataLimiteISO = new Date(data.dataLimite + 'T23:59:59').toISOString();
              await this.selecionarImagemECriar(
                data.titulo.trim(),
                data.descricao?.trim() || '',
                dataLimiteISO
              );
              return true;
            } else {
              await this.mostrarToast('Por favor, preencha título e data limite', 'warning');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre um ActionSheet para selecionar imagem (opcional) antes de criar a tarefa
   * @param titulo - Título da tarefa
   * @param descricao - Descrição da tarefa
   * @param dataLimite - Data limite da tarefa (formato ISO)
   */
  async selecionarImagemECriar(titulo: string, descricao: string, dataLimite: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Adicionar imagem à tarefa?',
      buttons: [
        {
          text: 'Adicionar Imagem',
          icon: 'image-outline',
          handler: async () => {
            // Fecha o ActionSheet antes de abrir o seletor de imagem
            await actionSheet.dismiss();
            const imagem = await this.selecionarImagem();
            if (imagem) {
              await this.selecionarProjetoParaCriar(titulo, descricao, dataLimite, imagem);
            } else {
              // Se cancelou a seleção de imagem, oferece novamente
              await this.selecionarImagemECriar(titulo, descricao, dataLimite);
            }
          }
        },
        {
          text: 'Continuar sem Imagem',
          handler: async () => {
            await actionSheet.dismiss();
            await this.selecionarProjetoParaCriar(titulo, descricao, dataLimite);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Abre um ActionSheet para selecionar o projeto antes de criar a tarefa
   * @param titulo - Título da tarefa
   * @param descricao - Descrição da tarefa
   * @param dataLimite - Data limite da tarefa (formato ISO)
   * @param imagem - URL base64 da imagem (opcional)
   */
  async selecionarProjetoParaCriar(titulo: string, descricao: string, dataLimite: string, imagem?: string) {
    const buttons: any[] = this.projetos.map(proj => ({
      text: proj.nome,
      handler: async () => {
        await this.criarTarefa(titulo, descricao, dataLimite, proj.id, imagem);
      }
    }));

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Selecione o projeto',
      buttons: buttons
    });

    await actionSheet.present();
  }

  /**
   * Cria uma nova tarefa através do service
   * @param titulo - Título da tarefa
   * @param descricao - Descrição da tarefa
   * @param dataLimite - Data limite (formato ISO)
   * @param projetoId - ID do projeto
   * @param imagem - URL base64 da imagem (opcional)
   */
  async criarTarefa(titulo: string, descricao: string, dataLimite: string, projetoId: string, imagem?: string) {
    try {
      // Verifica se já existe uma tarefa com o mesmo título no mesmo projeto
      const existe = await this.tarefaService.existePorTitulo(titulo, projetoId);
      if (existe) {
        await this.mostrarToast('Já existe uma tarefa com esse título neste projeto', 'warning');
        return;
      }

      await this.tarefaService.create({
        titulo: titulo,
        descricao: descricao,
        dataLimite: dataLimite,
        projetoId: projetoId,
        imagem: imagem
      });
      await this.carregarDados();
      await this.mostrarToast('Tarefa adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      await this.mostrarToast('Erro ao adicionar tarefa', 'danger');
    }
  }

  /**
   * Abre um alert para editar uma tarefa existente
   * @param tarefa - Tarefa a editar
   */
  async editarTarefa(tarefa: Tarefa) {
    if (this.projetos.length === 0) {
      await this.mostrarToast('Não há projetos disponíveis', 'warning');
      return;
    }

    // Converte data ISO para formato date input (YYYY-MM-DD)
    const dataLimiteDate = new Date(tarefa.dataLimite).toISOString().split('T')[0];

    const alert = await this.alertController.create({
      header: 'Editar Tarefa',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          value: tarefa.titulo,
          placeholder: 'Título da tarefa',
          attributes: {
            maxlength: 100,
            required: true
          }
        },
        {
          name: 'descricao',
          type: 'text',
          value: tarefa.descricao,
          placeholder: 'Descrição da tarefa (opcional)',
          attributes: {
            maxlength: 500
          }
        },
        {
          name: 'dataLimite',
          type: 'date',
          value: dataLimiteDate,
          placeholder: 'Data limite',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: async (data) => {
            if (data.titulo && data.titulo.trim() && data.dataLimite) {
              // Converte a data para formato ISO
              const dataLimiteISO = new Date(data.dataLimite + 'T23:59:59').toISOString();
              await this.selecionarImagemParaEditar(
                tarefa,
                data.titulo.trim(),
                data.descricao?.trim() || '',
                dataLimiteISO
              );
              return true;
            } else {
              await this.mostrarToast('Por favor, preencha título e data limite', 'warning');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre um ActionSheet para selecionar o projeto antes de atualizar a tarefa
   * @param tarefaId - ID da tarefa a atualizar
   * @param titulo - Novo título da tarefa
   * @param descricao - Nova descrição da tarefa
   * @param dataLimite - Nova data limite (formato ISO)
   * @param projetoIdAtual - ID do projeto atual da tarefa
   * @param imagemAtual - URL base64 da imagem atual (opcional)
   */
  async selecionarProjetoParaEditar(
    tarefaId: string,
    titulo: string,
    descricao: string,
    dataLimite: string,
    projetoIdAtual: string,
    imagemAtual?: string
  ) {
    const buttons: any[] = this.projetos.map(proj => ({
      text: proj.nome,
      handler: async () => {
        await this.atualizarTarefa(tarefaId, titulo, descricao, dataLimite, proj.id, imagemAtual);
      }
    }));

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Selecione o projeto',
      buttons: buttons
    });

    await actionSheet.present();
  }

  /**
   * Abre um ActionSheet para selecionar/alterar imagem antes de editar a tarefa
   * @param tarefa - Tarefa a editar
   * @param titulo - Novo título da tarefa
   * @param descricao - Nova descrição da tarefa
   * @param dataLimite - Nova data limite (formato ISO)
   */
  async selecionarImagemParaEditar(tarefa: Tarefa, titulo: string, descricao: string, dataLimite: string) {
    const actionSheet = await this.actionSheetController.create({
      header: tarefa.imagem ? 'Alterar imagem da tarefa?' : 'Adicionar imagem à tarefa?',
      buttons: [
        {
          text: 'Adicionar/Alterar Imagem',
          icon: 'image-outline',
          handler: async () => {
            await actionSheet.dismiss();
            const imagem = await this.selecionarImagem();
            if (imagem !== undefined) {
              await this.selecionarProjetoParaEditar(tarefa.id, titulo, descricao, dataLimite, tarefa.projetoId, imagem);
            } else {
              // Se cancelou, oferece novamente
              await this.selecionarImagemParaEditar(tarefa, titulo, descricao, dataLimite);
            }
          }
        },
        {
          text: tarefa.imagem ? 'Remover Imagem' : 'Continuar sem Imagem',
          icon: tarefa.imagem ? 'trash-outline' : undefined,
          handler: async () => {
            await actionSheet.dismiss();
            await this.selecionarProjetoParaEditar(tarefa.id, titulo, descricao, dataLimite, tarefa.projetoId);
          }
        },
        {
          text: 'Manter Imagem Atual',
          handler: async () => {
            await actionSheet.dismiss();
            await this.selecionarProjetoParaEditar(tarefa.id, titulo, descricao, dataLimite, tarefa.projetoId, tarefa.imagem);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Atualiza uma tarefa existente através do service
   * @param id - ID da tarefa a atualizar
   * @param titulo - Novo título
   * @param descricao - Nova descrição
   * @param dataLimite - Nova data limite (formato ISO)
   * @param projetoId - Novo ID do projeto
   * @param imagem - Nova URL base64 da imagem (opcional, undefined para remover)
   */
  async atualizarTarefa(
    id: string,
    titulo: string,
    descricao: string,
    dataLimite: string,
    projetoId: string,
    imagem?: string
  ) {
    try {
      // Verifica se já existe outra tarefa com o mesmo título no mesmo projeto
      const existe = await this.tarefaService.existePorTitulo(titulo, projetoId, id);
      if (existe) {
        await this.mostrarToast('Já existe uma tarefa com esse título neste projeto', 'warning');
        return;
      }

      const tarefaAtualizada: Tarefa = {
        id: id,
        titulo: titulo,
        descricao: descricao,
        dataLimite: dataLimite,
        projetoId: projetoId,
        imagem: imagem
      };

      const sucesso = await this.tarefaService.update(tarefaAtualizada);
      if (sucesso) {
        await this.carregarDados();
        await this.mostrarToast('Tarefa atualizada com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao atualizar tarefa', 'danger');
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      await this.mostrarToast('Erro ao atualizar tarefa', 'danger');
    }
  }

  /**
   * Abre um alert de confirmação antes de eliminar uma tarefa
   * @param tarefa - Tarefa a eliminar
   */
  async confirmarEliminarTarefa(tarefa: Tarefa) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminação',
      message: `Tem certeza que deseja eliminar a tarefa "${tarefa.titulo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarTarefa(tarefa.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Elimina uma tarefa através do service
   * @param id - ID da tarefa a eliminar
   */
  async eliminarTarefa(id: string) {
    try {
      const sucesso = await this.tarefaService.delete(id);
      if (sucesso) {
        await this.carregarDados();
        await this.mostrarToast('Tarefa eliminada com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao eliminar tarefa', 'danger');
      }
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
      await this.mostrarToast('Erro ao eliminar tarefa', 'danger');
    }
  }

  /**
   * Seleciona uma imagem do dispositivo e converte para base64
   * @returns Promise<string | undefined> - URL base64 da imagem ou undefined se cancelado
   */
  async selecionarImagem(): Promise<string | undefined> {
    return new Promise((resolve) => {
      // Cria um input file dinâmico
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
          // Verifica o tamanho do arquivo (máximo 5MB)
          if (file.size > 5 * 1024 * 1024) {
            this.mostrarToast('Imagem muito grande. Máximo 5MB.', 'warning');
            resolve(undefined);
            return;
          }

          // Converte para base64
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const base64 = e.target?.result as string;
            resolve(base64);
          };
          reader.onerror = () => {
            this.mostrarToast('Erro ao processar imagem', 'danger');
            resolve(undefined);
          };
          reader.readAsDataURL(file);
        } else {
          resolve(undefined);
        }
        
        // Remove o input do DOM
        document.body.removeChild(input);
      };

      input.oncancel = () => {
        resolve(undefined);
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      };

      // Adiciona o input ao DOM e aciona o clique
      document.body.appendChild(input);
      input.click();
    });
  }

  /**
   * Mostra uma mensagem toast ao utilizador
   * @param mensagem - Mensagem a exibir
   * @param cor - Cor do toast (success, danger, warning)
   */
  async mostrarToast(mensagem: string, cor: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { ProjetoService } from '../services/projeto.service';
import { CategoriaService } from '../services/categoria.service';
import { Projeto } from '../models/projeto.model';
import { Categoria } from '../models/categoria.model';

/**
 * Página de gestão de projetos
 * Permite visualizar, adicionar, editar e eliminar projetos
 */
@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.page.html',
  styleUrls: ['./projetos.page.scss'],
  standalone: false,
})
export class ProjetosPage implements OnInit {
  /** Array com todos os projetos */
  projetos: Projeto[] = [];

  /** Array com projetos filtrados (exibidos) */
  projetosFiltrados: Projeto[] = [];

  /** Array com todas as categorias */
  categorias: Categoria[] = [];

  /** Flag para indicar se está a carregar dados */
  carregando = false;

  /** ID da categoria selecionada no filtro ('todos' = todas) */
  categoriaFiltro: string = 'todos';

  constructor(
    private projetoService: ProjetoService,
    private categoriaService: CategoriaService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  /**
   * Inicializa a página carregando os projetos e categorias
   */
  async ngOnInit() {
    await this.carregarDados();
  }

  /**
   * Carrega projetos e categorias
   */
  async carregarDados() {
    try {
      this.carregando = true;
      this.categorias = await this.categoriaService.getAll();
      this.projetos = await this.projetoService.getAll();
      this.aplicarFiltro();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.mostrarToast('Erro ao carregar projetos', 'danger');
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Filtra os projetos por categoria
   * @param categoriaId - ID da categoria para filtrar ('todos' = todas)
   */
  filtrarPorCategoria(categoriaId: string | number | undefined) {
    this.categoriaFiltro = String(categoriaId || 'todos');
    this.aplicarFiltro();
  }

  /**
   * Aplica o filtro atual aos projetos
   */
  aplicarFiltro() {
    if (this.categoriaFiltro === 'todos') {
      // Mostrar todos os projetos
      this.projetosFiltrados = [...this.projetos];
    } else {
      // Filtrar por categoria
      this.projetosFiltrados = this.projetos.filter(
        projeto => projeto.categoriaId === this.categoriaFiltro
      );
    }
  }

  /**
   * Obtém o nome da categoria pelo ID
   * @param categoriaId - ID da categoria
   * @returns string - Nome da categoria ou 'Sem categoria'
   */
  obterNomeCategoria(categoriaId: string): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }

  /**
   * Abre um alert para adicionar um novo projeto
   */
  async adicionarProjeto() {
    if (this.categorias.length === 0) {
      await this.mostrarToast('Crie uma categoria primeiro', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Novo Projeto',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome do projeto',
          attributes: {
            maxlength: 50,
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
            if (data.nome && data.nome.trim()) {
              await this.selecionarCategoriaParaCriar(data.nome.trim());
              return true;
            } else {
              await this.mostrarToast('Por favor, insira um nome válido', 'warning');
              return false; // Impede o fecho do alert
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre um ActionSheet para selecionar a categoria antes de criar o projeto
   * @param nome - Nome do projeto a criar
   */
  async selecionarCategoriaParaCriar(nome: string) {
    const buttons: any[] = this.categorias.map(cat => ({
      text: cat.nome,
      handler: async () => {
        await this.criarProjeto(nome, cat.id);
      }
    }));

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Selecione a categoria',
      buttons: buttons
    });

    await actionSheet.present();
  }

  /**
   * Cria um novo projeto através do service
   * @param nome - Nome do projeto a criar
   * @param categoriaId - ID da categoria
   */
  async criarProjeto(nome: string, categoriaId: string) {
    try {
      // Verifica se já existe um projeto com o mesmo nome na mesma categoria
      const existe = await this.projetoService.existePorNome(nome, categoriaId);
      if (existe) {
        await this.mostrarToast('Já existe um projeto com esse nome nesta categoria', 'warning');
        return;
      }

      await this.projetoService.create(nome, categoriaId);
      await this.carregarDados();
      await this.mostrarToast('Projeto adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      await this.mostrarToast('Erro ao adicionar projeto', 'danger');
    }
  }

  /**
   * Abre um alert para editar um projeto existente
   * @param projeto - Projeto a editar
   */
  async editarProjeto(projeto: Projeto) {
    if (this.categorias.length === 0) {
      await this.mostrarToast('Não há categorias disponíveis', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Editar Projeto',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          value: projeto.nome,
          placeholder: 'Nome do projeto',
          attributes: {
            maxlength: 50,
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
            if (data.nome && data.nome.trim()) {
              await this.selecionarCategoriaParaEditar(projeto.id, data.nome.trim(), projeto.categoriaId);
              return true;
            } else {
              await this.mostrarToast('Por favor, insira um nome válido', 'warning');
              return false; // Impede o fecho do alert
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre um ActionSheet para selecionar a categoria antes de atualizar o projeto
   * @param projetoId - ID do projeto a atualizar
   * @param nome - Novo nome do projeto
   * @param categoriaIdAtual - ID da categoria atual do projeto
   */
  async selecionarCategoriaParaEditar(projetoId: string, nome: string, categoriaIdAtual: string) {
    const buttons: any[] = this.categorias.map(cat => ({
      text: cat.nome,
      handler: async () => {
        await this.atualizarProjeto(projetoId, nome, cat.id);
      }
    }));

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Selecione a categoria',
      buttons: buttons
    });

    await actionSheet.present();
  }

  /**
   * Atualiza um projeto existente através do service
   * @param id - ID do projeto a atualizar
   * @param nome - Novo nome do projeto
   * @param categoriaId - Novo ID da categoria
   */
  async atualizarProjeto(id: string, nome: string, categoriaId: string) {
    try {
      // Verifica se já existe outro projeto com o mesmo nome na mesma categoria
      const existe = await this.projetoService.existePorNome(nome, categoriaId, id);
      if (existe) {
        await this.mostrarToast('Já existe um projeto com esse nome nesta categoria', 'warning');
        return;
      }

      const projetoAtualizado: Projeto = {
        id: id,
        nome: nome,
        categoriaId: categoriaId
      };

      const sucesso = await this.projetoService.update(projetoAtualizado);
      if (sucesso) {
        await this.carregarDados();
        await this.mostrarToast('Projeto atualizado com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao atualizar projeto', 'danger');
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      await this.mostrarToast('Erro ao atualizar projeto', 'danger');
    }
  }

  /**
   * Abre um alert de confirmação antes de eliminar um projeto
   * @param projeto - Projeto a eliminar
   */
  async confirmarEliminarProjeto(projeto: Projeto) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminação',
      message: `Tem certeza que deseja eliminar o projeto "${projeto.nome}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarProjeto(projeto.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Elimina um projeto através do service
   * @param id - ID do projeto a eliminar
   */
  async eliminarProjeto(id: string) {
    try {
      const sucesso = await this.projetoService.delete(id);
      if (sucesso) {
        await this.carregarDados();
        await this.mostrarToast('Projeto eliminado com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao eliminar projeto', 'danger');
      }
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      await this.mostrarToast('Erro ao eliminar projeto', 'danger');
    }
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

import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

/**
 * Página de gestão de categorias
 * Permite visualizar, adicionar, editar e eliminar categorias
 */
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false,
})
export class CategoriasPage implements OnInit {
  /** Array com todas as categorias */
  categorias: Categoria[] = [];

  /** Flag para indicar se está a carregar dados */
  carregando = false;

  constructor(
    private categoriaService: CategoriaService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  /**
   * Inicializa a página carregando as categorias
   */
  async ngOnInit() {
    await this.carregarCategorias();
  }

  /**
   * Carrega todas as categorias do service
   */
  async carregarCategorias() {
    try {
      this.carregando = true;
      this.categorias = await this.categoriaService.getAll();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      await this.mostrarToast('Erro ao carregar categorias', 'danger');
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Abre um alert para adicionar uma nova categoria
   */
  async adicionarCategoria() {
    const alert = await this.alertController.create({
      header: 'Nova Categoria',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome da categoria',
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
          text: 'Adicionar',
          handler: async (data) => {
            if (data.nome && data.nome.trim()) {
              await this.criarCategoria(data.nome.trim());
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
   * Cria uma nova categoria através do service
   * @param nome - Nome da categoria a criar
   */
  async criarCategoria(nome: string) {
    try {
      // Verifica se já existe uma categoria com o mesmo nome
      const existe = await this.categoriaService.existePorNome(nome);
      if (existe) {
        await this.mostrarToast('Já existe uma categoria com esse nome', 'warning');
        return;
      }

      await this.categoriaService.create(nome);
      await this.carregarCategorias();
      await this.mostrarToast('Categoria adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      await this.mostrarToast('Erro ao adicionar categoria', 'danger');
    }
  }

  /**
   * Abre um alert para editar uma categoria existente
   * @param categoria - Categoria a editar
   */
  async editarCategoria(categoria: Categoria) {
    const alert = await this.alertController.create({
      header: 'Editar Categoria',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          value: categoria.nome,
          placeholder: 'Nome da categoria',
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
          text: 'Guardar',
          handler: async (data) => {
            if (data.nome && data.nome.trim()) {
              await this.atualizarCategoria(categoria.id, data.nome.trim());
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
   * Atualiza uma categoria existente através do service
   * @param id - ID da categoria a atualizar
   * @param nome - Novo nome da categoria
   */
  async atualizarCategoria(id: string, nome: string) {
    try {
      // Verifica se já existe outra categoria com o mesmo nome
      const existe = await this.categoriaService.existePorNome(nome, id);
      if (existe) {
        await this.mostrarToast('Já existe uma categoria com esse nome', 'warning');
        return;
      }

      const categoriaAtualizada: Categoria = {
        id: id,
        nome: nome
      };

      const sucesso = await this.categoriaService.update(categoriaAtualizada);
      if (sucesso) {
        await this.carregarCategorias();
        await this.mostrarToast('Categoria atualizada com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao atualizar categoria', 'danger');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      await this.mostrarToast('Erro ao atualizar categoria', 'danger');
    }
  }

  /**
   * Abre um alert de confirmação antes de eliminar uma categoria
   * @param categoria - Categoria a eliminar
   */
  async confirmarEliminarCategoria(categoria: Categoria) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminação',
      message: `Tem certeza que deseja eliminar a categoria "${categoria.nome}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarCategoria(categoria.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Elimina uma categoria através do service
   * @param id - ID da categoria a eliminar
   */
  async eliminarCategoria(id: string) {
    try {
      const sucesso = await this.categoriaService.delete(id);
      if (sucesso) {
        await this.carregarCategorias();
        await this.mostrarToast('Categoria eliminada com sucesso', 'success');
      } else {
        await this.mostrarToast('Erro ao eliminar categoria', 'danger');
      }
    } catch (error) {
      console.error('Erro ao eliminar categoria:', error);
      await this.mostrarToast('Erro ao eliminar categoria', 'danger');
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

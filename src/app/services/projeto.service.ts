import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Projeto } from '../models/projeto.model';
import { CategoriaService } from './categoria.service';

/**
 * Service responsável pela gestão de projetos
 * Isola toda a lógica de manipulação de projetos, incluindo CRUD completo
 * Utiliza Ionic Storage para persistência de dados
 */
@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private readonly STORAGE_KEY = 'projetos';

  constructor(
    private storage: Storage,
    private categoriaService: CategoriaService
  ) {
    this.initStorage();
  }

  /**
   * Inicializa o storage
   */
  private async initStorage(): Promise<void> {
    await this.storage.create();
  }

  /**
   * Gera um ID único para um novo projeto
   * @returns string - ID único baseado em timestamp
   */
  private gerarId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém todos os projetos
   * @returns Promise<Projeto[]> - Array com todos os projetos
   */
  async getAll(): Promise<Projeto[]> {
    try {
      const projetos = await this.storage.get(this.STORAGE_KEY);
      return projetos || [];
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
      return [];
    }
  }

  /**
   * Obtém um projeto por ID
   * @param id - ID do projeto a buscar
   * @returns Promise<Projeto | null> - Projeto encontrado ou null
   */
  async getById(id: string): Promise<Projeto | null> {
    try {
      const projetos = await this.getAll();
      return projetos.find(proj => proj.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      return null;
    }
  }

  /**
   * Obtém todos os projetos de uma categoria específica
   * @param categoriaId - ID da categoria para filtrar
   * @returns Promise<Projeto[]> - Array com projetos da categoria
   */
  async getByCategoria(categoriaId: string): Promise<Projeto[]> {
    try {
      const projetos = await this.getAll();
      return projetos.filter(proj => proj.categoriaId === categoriaId);
    } catch (error) {
      console.error('Erro ao obter projetos por categoria:', error);
      return [];
    }
  }

  /**
   * Adiciona um novo projeto
   * @param nome - Nome do projeto a ser criado
   * @param categoriaId - ID da categoria à qual o projeto pertence
   * @returns Promise<Projeto> - Projeto criado com ID gerado
   */
  async create(nome: string, categoriaId: string): Promise<Projeto> {
    try {
      // Valida se a categoria existe
      const categoria = await this.categoriaService.getById(categoriaId);
      if (!categoria) {
        throw new Error('Categoria não encontrada');
      }

      const projetos = await this.getAll();
      const novoProjeto: Projeto = {
        id: this.gerarId(),
        nome: nome.trim(),
        categoriaId: categoriaId
      };
      projetos.push(novoProjeto);
      await this.storage.set(this.STORAGE_KEY, projetos);
      return novoProjeto;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um projeto existente
   * @param projeto - Projeto com os dados atualizados
   * @returns Promise<boolean> - true se atualizado com sucesso, false caso contrário
   */
  async update(projeto: Projeto): Promise<boolean> {
    try {
      // Valida se a categoria existe
      const categoria = await this.categoriaService.getById(projeto.categoriaId);
      if (!categoria) {
        return false;
      }

      const projetos = await this.getAll();
      const index = projetos.findIndex(proj => proj.id === projeto.id);
      
      if (index === -1) {
        return false;
      }

      projetos[index] = {
        ...projeto,
        nome: projeto.nome.trim()
      };
      await this.storage.set(this.STORAGE_KEY, projetos);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return false;
    }
  }

  /**
   * Elimina um projeto por ID
   * @param id - ID do projeto a ser eliminado
   * @returns Promise<boolean> - true se eliminado com sucesso, false caso contrário
   */
  async delete(id: string): Promise<boolean> {
    try {
      const projetos = await this.getAll();
      const projetosFiltrados = projetos.filter(proj => proj.id !== id);
      
      if (projetos.length === projetosFiltrados.length) {
        return false; // Projeto não encontrado
      }

      await this.storage.set(this.STORAGE_KEY, projetosFiltrados);
      return true;
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      return false;
    }
  }

  /**
   * Verifica se um projeto existe pelo nome (útil para validações)
   * @param nome - Nome do projeto a verificar
   * @param categoriaId - ID da categoria (pode haver projetos com mesmo nome em categorias diferentes)
   * @param excludeId - ID a excluir da verificação (útil na edição)
   * @returns Promise<boolean> - true se já existe, false caso contrário
   */
  async existePorNome(nome: string, categoriaId: string, excludeId?: string): Promise<boolean> {
    try {
      const projetos = await this.getAll();
      const nomeNormalizado = nome.trim().toLowerCase();
      return projetos.some(proj => 
        proj.nome.toLowerCase() === nomeNormalizado && 
        proj.categoriaId === categoriaId &&
        (!excludeId || proj.id !== excludeId)
      );
    } catch (error) {
      console.error('Erro ao verificar existência do projeto:', error);
      return false;
    }
  }
}

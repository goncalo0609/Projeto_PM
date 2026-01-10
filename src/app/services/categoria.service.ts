import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Categoria } from '../models/categoria.model';

/**
 * Service responsável pela gestão de categorias de projetos
 * Isola toda a lógica de manipulação de categorias, incluindo CRUD completo
 * Utiliza Ionic Storage para persistência de dados
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly STORAGE_KEY = 'categorias';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  /**
   * Inicializa o storage e cria dados padrão se necessário
   */
  private async initStorage(): Promise<void> {
    await this.storage.create();
    const categorias = await this.getAll();
    
    // Se não existirem categorias, cria as categorias padrão
    if (categorias.length === 0) {
      const categoriasPadrao: Categoria[] = [
        { id: this.gerarId(), nome: 'Escola' },
        { id: this.gerarId(), nome: 'Trabalho' },
        { id: this.gerarId(), nome: 'Pessoal' }
      ];
      await this.storage.set(this.STORAGE_KEY, categoriasPadrao);
    }
  }

  /**
   * Gera um ID único para uma nova categoria
   * @returns string - ID único baseado em timestamp
   */
  private gerarId(): string {
    return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém todas as categorias
   * @returns Promise<Categoria[]> - Array com todas as categorias
   */
  async getAll(): Promise<Categoria[]> {
    try {
      const categorias = await this.storage.get(this.STORAGE_KEY);
      return categorias || [];
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      return [];
    }
  }

  /**
   * Obtém uma categoria por ID
   * @param id - ID da categoria a buscar
   * @returns Promise<Categoria | null> - Categoria encontrada ou null
   */
  async getById(id: string): Promise<Categoria | null> {
    try {
      const categorias = await this.getAll();
      return categorias.find(cat => cat.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter categoria por ID:', error);
      return null;
    }
  }

  /**
   * Adiciona uma nova categoria
   * @param nome - Nome da categoria a ser criada
   * @returns Promise<Categoria> - Categoria criada com ID gerado
   */
  async create(nome: string): Promise<Categoria> {
    try {
      const categorias = await this.getAll();
      const novaCategoria: Categoria = {
        id: this.gerarId(),
        nome: nome.trim()
      };
      categorias.push(novaCategoria);
      await this.storage.set(this.STORAGE_KEY, categorias);
      return novaCategoria;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma categoria existente
   * @param categoria - Categoria com os dados atualizados
   * @returns Promise<boolean> - true se atualizado com sucesso, false caso contrário
   */
  async update(categoria: Categoria): Promise<boolean> {
    try {
      const categorias = await this.getAll();
      const index = categorias.findIndex(cat => cat.id === categoria.id);
      
      if (index === -1) {
        return false;
      }

      categorias[index] = {
        ...categoria,
        nome: categoria.nome.trim()
      };
      await this.storage.set(this.STORAGE_KEY, categorias);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return false;
    }
  }

  /**
   * Elimina uma categoria por ID
   * @param id - ID da categoria a ser eliminada
   * @returns Promise<boolean> - true se eliminada com sucesso, false caso contrário
   */
  async delete(id: string): Promise<boolean> {
    try {
      const categorias = await this.getAll();
      const categoriasFiltradas = categorias.filter(cat => cat.id !== id);
      
      if (categorias.length === categoriasFiltradas.length) {
        return false; // Categoria não encontrada
      }

      await this.storage.set(this.STORAGE_KEY, categoriasFiltradas);
      return true;
    } catch (error) {
      console.error('Erro ao eliminar categoria:', error);
      return false;
    }
  }

  /**
   * Verifica se uma categoria existe pelo nome (útil para validações)
   * @param nome - Nome da categoria a verificar
   * @param excludeId - ID a excluir da verificação (útil na edição)
   * @returns Promise<boolean> - true se já existe, false caso contrário
   */
  async existePorNome(nome: string, excludeId?: string): Promise<boolean> {
    try {
      const categorias = await this.getAll();
      const nomeNormalizado = nome.trim().toLowerCase();
      return categorias.some(cat => 
        cat.nome.toLowerCase() === nomeNormalizado && 
        (!excludeId || cat.id !== excludeId)
      );
    } catch (error) {
      console.error('Erro ao verificar existência da categoria:', error);
      return false;
    }
  }
}

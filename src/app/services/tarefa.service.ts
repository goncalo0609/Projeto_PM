import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tarefa } from '../models/tarefa.model';
import { ProjetoService } from './projeto.service';

/**
 * Service responsável pela gestão de tarefas
 * Isola toda a lógica de manipulação de tarefas, incluindo CRUD completo
 * Utiliza Ionic Storage para persistência de dados
 */
@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly STORAGE_KEY = 'tarefas';

  constructor(
    private storage: Storage,
    private projetoService: ProjetoService
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
   * Gera um ID único para uma nova tarefa
   * @returns string - ID único baseado em timestamp
   */
  private gerarId(): string {
    return `tarefa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Verifica se uma tarefa está em atraso
   * @param dataLimite - Data limite da tarefa (formato ISO string)
   * @returns boolean - true se está em atraso, false caso contrário
   */
  private estaEmAtraso(dataLimite: string): boolean {
    try {
      const dataLimiteObj = new Date(dataLimite);
      const agora = new Date();
      agora.setHours(0, 0, 0, 0); // Remove horas para comparar apenas datas
      dataLimiteObj.setHours(0, 0, 0, 0);
      return dataLimiteObj < agora;
    } catch (error) {
      console.error('Erro ao verificar se tarefa está em atraso:', error);
      return false;
    }
  }

  /**
   * Obtém todas as tarefas
   * @returns Promise<Tarefa[]> - Array com todas as tarefas
   */
  async getAll(): Promise<Tarefa[]> {
    try {
      const tarefas = await this.storage.get(this.STORAGE_KEY);
      const tarefasArray = tarefas || [];
      // Calcula emAtraso para todas as tarefas
      return tarefasArray.map(tarefa => ({
        ...tarefa,
        emAtraso: this.estaEmAtraso(tarefa.dataLimite)
      }));
    } catch (error) {
      console.error('Erro ao obter tarefas:', error);
      return [];
    }
  }

  /**
   * Obtém uma tarefa por ID
   * @param id - ID da tarefa a buscar
   * @returns Promise<Tarefa | null> - Tarefa encontrada ou null
   */
  async getById(id: string): Promise<Tarefa | null> {
    try {
      const tarefas = await this.getAll();
      return tarefas.find(tarefa => tarefa.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter tarefa por ID:', error);
      return null;
    }
  }

  /**
   * Obtém todas as tarefas de um projeto específico
   * @param projetoId - ID do projeto para filtrar
   * @returns Promise<Tarefa[]> - Array com tarefas do projeto
   */
  async getByProjeto(projetoId: string): Promise<Tarefa[]> {
    try {
      const tarefas = await this.getAll();
      return tarefas.filter(tarefa => tarefa.projetoId === projetoId);
    } catch (error) {
      console.error('Erro ao obter tarefas por projeto:', error);
      return [];
    }
  }

  /**
   * Adiciona uma nova tarefa
   * @param tarefa - Dados da tarefa a ser criada (sem id e emAtraso)
   * @returns Promise<Tarefa> - Tarefa criada com ID gerado
   */
  async create(tarefa: Omit<Tarefa, 'id' | 'emAtraso'>): Promise<Tarefa> {
    try {
      // Valida se o projeto existe
      const projeto = await this.projetoService.getById(tarefa.projetoId);
      if (!projeto) {
        throw new Error('Projeto não encontrado');
      }

      const tarefas = await this.storage.get(this.STORAGE_KEY) || [];
      const novaTarefa: Tarefa = {
        id: this.gerarId(),
        titulo: tarefa.titulo.trim(),
        descricao: tarefa.descricao.trim(),
        dataLimite: tarefa.dataLimite,
        projetoId: tarefa.projetoId,
        imagem: tarefa.imagem,
        emAtraso: this.estaEmAtraso(tarefa.dataLimite)
      };
      tarefas.push(novaTarefa);
      await this.storage.set(this.STORAGE_KEY, tarefas);
      return novaTarefa;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma tarefa existente
   * @param tarefa - Tarefa com os dados atualizados
   * @returns Promise<boolean> - true se atualizado com sucesso, false caso contrário
   */
  async update(tarefa: Tarefa): Promise<boolean> {
    try {
      // Valida se o projeto existe
      const projeto = await this.projetoService.getById(tarefa.projetoId);
      if (!projeto) {
        return false;
      }

      const tarefas = await this.storage.get(this.STORAGE_KEY) || [];
      const index = tarefas.findIndex(t => t.id === tarefa.id);
      
      if (index === -1) {
        return false;
      }

      tarefas[index] = {
        ...tarefa,
        titulo: tarefa.titulo.trim(),
        descricao: tarefa.descricao.trim(),
        emAtraso: this.estaEmAtraso(tarefa.dataLimite)
      };
      await this.storage.set(this.STORAGE_KEY, tarefas);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return false;
    }
  }

  /**
   * Elimina uma tarefa por ID
   * @param id - ID da tarefa a ser eliminada
   * @returns Promise<boolean> - true se eliminada com sucesso, false caso contrário
   */
  async delete(id: string): Promise<boolean> {
    try {
      const tarefas = await this.storage.get(this.STORAGE_KEY) || [];
      const tarefasFiltradas = tarefas.filter(t => t.id !== id);
      
      if (tarefas.length === tarefasFiltradas.length) {
        return false; // Tarefa não encontrada
      }

      await this.storage.set(this.STORAGE_KEY, tarefasFiltradas);
      return true;
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
      return false;
    }
  }

  /**
   * Verifica se uma tarefa existe pelo título (útil para validações)
   * @param titulo - Título da tarefa a verificar
   * @param projetoId - ID do projeto (pode haver tarefas com mesmo título em projetos diferentes)
   * @param excludeId - ID a excluir da verificação (útil na edição)
   * @returns Promise<boolean> - true se já existe, false caso contrário
   */
  async existePorTitulo(titulo: string, projetoId: string, excludeId?: string): Promise<boolean> {
    try {
      const tarefas = await this.getAll();
      const tituloNormalizado = titulo.trim().toLowerCase();
      return tarefas.some(t => 
        t.titulo.toLowerCase() === tituloNormalizado && 
        t.projetoId === projetoId &&
        (!excludeId || t.id !== excludeId)
      );
    } catch (error) {
      console.error('Erro ao verificar existência da tarefa:', error);
      return false;
    }
  }
}

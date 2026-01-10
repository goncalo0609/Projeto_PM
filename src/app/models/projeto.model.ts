/**
 * Interface que representa um projeto
 * Um projeto agrupa tarefas e pertence a uma categoria
 */
export interface Projeto {
  /** Identificador único do projeto */
  id: string;
  /** Nome do projeto */
  nome: string;
  /** ID da categoria à qual o projeto pertence */
  categoriaId: string;
}

/**
 * Interface que representa uma tarefa
 * Uma tarefa pertence a um projeto e tem data limite e imagem
 */
export interface Tarefa {
  /** Identificador único da tarefa */
  id: string;
  /** Título da tarefa */
  titulo: string;
  /** Descrição detalhada da tarefa */
  descricao: string;
  /** Data limite para conclusão da tarefa (formato ISO string: YYYY-MM-DDTHH:mm:ss) */
  dataLimite: string;
  /** Caminho/URL da imagem associada à tarefa */
  imagem?: string;
  /** ID do projeto ao qual a tarefa pertence */
  projetoId: string;
  /** Indica se a tarefa está em atraso (calculado) */
  emAtraso?: boolean;
}

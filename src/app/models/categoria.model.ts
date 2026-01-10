/**
 * Interface que representa uma categoria de projeto
 * Exemplos: Escola, Trabalho, Pessoal
 */
export interface Categoria {
  /** Identificador único da categoria */
  id: string;
  /** Nome da categoria (ex: Escola, Trabalho, Pessoal) */
  nome: string;
}

/**
 * Exportação centralizada de todos os services da aplicação
 * Facilita a importação em outros módulos e componentes
 */
export { CategoriaService } from './categoria.service';
export { ProjetoService } from './projeto.service';
export { TarefaService } from './tarefa.service';
export { NotificacaoService } from './notificacao.service';
export { I18nService } from './i18n.service';
export { SqliteService } from './sqlite.service';
export { FeriadoService } from './feriado.service';
export type { Feriado } from './feriado.service';
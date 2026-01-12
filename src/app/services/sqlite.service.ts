import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';

/**
 * Service responsável pela gestão da base de dados SQLite
 * Fornece métodos para inicializar a base de dados e executar queries
 */
@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'projeto_pm_db';
  private readonly DB_VERSION = 1;
  private isInitialized = false;

  constructor(private platform: Platform) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  /**
   * Inicializa a base de dados e cria as tabelas se necessário
   * @returns Promise<boolean> - true se inicializada com sucesso
   */
  async initializeDatabase(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Verifica se está em plataforma nativa
      if (!Capacitor.isNativePlatform()) {
        console.warn('SQLite só funciona em plataformas nativas (iOS/Android)');
        return false;
      }

      // Cria ou abre a conexão com a base de dados
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        false, // encrypted
        'no-encryption',
        this.DB_VERSION,
        false // readonly
      );

      await this.db.open();

      // Cria as tabelas se não existirem
      await this.createTables();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar base de dados SQLite:', error);
      return false;
    }
  }

  /**
   * Cria todas as tabelas necessárias
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Base de dados não inicializada');
    }

    // Tabela de categorias
    const createCategoriasTable = `
      CREATE TABLE IF NOT EXISTS categorias (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL UNIQUE
      );
    `;

    // Tabela de projetos
    const createProjetosTable = `
      CREATE TABLE IF NOT EXISTS projetos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        categoriaId TEXT NOT NULL,
        FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON DELETE CASCADE
      );
    `;

    // Tabela de tarefas
    const createTarefasTable = `
      CREATE TABLE IF NOT EXISTS tarefas (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        dataLimite TEXT NOT NULL,
        projetoId TEXT NOT NULL,
        imagem TEXT,
        FOREIGN KEY (projetoId) REFERENCES projetos(id) ON DELETE CASCADE
      );
    `;

    // Cria índices para melhor performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_projetos_categoria ON projetos(categoriaId);',
      'CREATE INDEX IF NOT EXISTS idx_tarefas_projeto ON tarefas(projetoId);',
      'CREATE INDEX IF NOT EXISTS idx_tarefas_dataLimite ON tarefas(dataLimite);'
    ];

    await this.db.execute(createCategoriasTable);
    await this.db.execute(createProjetosTable);
    await this.db.execute(createTarefasTable);

    // Cria índices
    for (const indexSQL of createIndexes) {
      await this.db.execute(indexSQL);
    }
  }

  /**
   * Obtém a conexão com a base de dados
   * @returns SQLiteDBConnection - Conexão com a base de dados
   */
  async getDatabase(): Promise<SQLiteDBConnection> {
    if (!this.isInitialized) {
      await this.initializeDatabase();
    }

    if (!this.db) {
      throw new Error('Base de dados não disponível');
    }

    return this.db;
  }

  /**
   * Executa uma query SQL
   * @param query - Query SQL a executar
   * @param values - Valores para substituir os placeholders (opcional)
   * @returns Promise<any> - Resultado da query
   */
  async executeQuery(query: string, values?: any[]): Promise<any> {
    const db = await this.getDatabase();
    return await db.query(query, values || []);
  }

  /**
   * Executa um comando SQL (INSERT, UPDATE, DELETE)
   * @param statement - Comando SQL a executar
   * @param values - Valores para substituir os placeholders (opcional)
   * @returns Promise<any> - Resultado do comando
   */
  async executeStatement(statement: string, values?: any[]): Promise<any> {
    const db = await this.getDatabase();
    return await db.run(statement, values || []);
  }

  /**
   * Fecha a conexão com a base de dados
   */
  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      await this.sqlite.closeConnection(this.DB_NAME, false);
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Verifica se a base de dados está inicializada
   * @returns boolean - true se inicializada
   */
  isDatabaseInitialized(): boolean {
    return this.isInitialized;
  }
}

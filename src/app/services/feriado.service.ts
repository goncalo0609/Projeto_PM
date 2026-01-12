import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface para representar um feriado
 */
export interface Feriado {
  date: string; // Data no formato YYYY-MM-DD
  localName: string; // Nome local do feriado
  name: string; // Nome do feriado
  countryCode: string; // Código do país (ex: PT)
  fixed: boolean; // Se é feriado fixo
  global: boolean; // Se é feriado global
  counties: string[] | null; // Condados (null para feriados nacionais)
  launchYear: number | null; // Ano de lançamento
  types: string[]; // Tipos do feriado
}

/**
 * Service responsável pela gestão de feriados
 * Utiliza a API Nager.Date (gratuita, sem API key)
 */
@Injectable({
  providedIn: 'root'
})
export class FeriadoService {
  private readonly API_BASE_URL = 'https://date.nager.at/api/v3';
  private readonly COUNTRY_CODE = 'PT'; // Portugal

  constructor(private http: HttpClient) {}

  /**
   * Obtém os feriados de um ano específico
   * @param ano - Ano para buscar feriados (padrão: ano atual)
   * @returns Promise<Feriado[]> - Array com os feriados do ano
   */
  async obterFeriados(ano?: number): Promise<Feriado[]> {
    const anoAtual = ano || new Date().getFullYear();
    const url = `${this.API_BASE_URL}/PublicHolidays/${anoAtual}/${this.COUNTRY_CODE}`;

    try {
      const feriados = await this.http.get<Feriado[]>(url).toPromise();
      return feriados || [];
    } catch (error) {
      console.error('Erro ao buscar feriados:', error);
      // Em caso de erro, retorna array vazio para não quebrar a aplicação
      return [];
    }
  }

  /**
   * Obtém os feriados de um mês específico
   * @param mes - Mês (1-12)
   * @param ano - Ano (padrão: ano atual)
   * @returns Promise<Feriado[]> - Array com os feriados do mês
   */
  async obterFeriadosDoMes(mes: number, ano?: number): Promise<Feriado[]> {
    const anoAtual = ano || new Date().getFullYear();
    const feriadosAno = await this.obterFeriados(anoAtual);
    
    // Filtra feriados do mês especificado
    return feriadosAno.filter(feriado => {
      const dataFeriado = new Date(feriado.date);
      return dataFeriado.getMonth() + 1 === mes; // getMonth() retorna 0-11
    });
  }

  /**
   * Verifica se uma data específica é feriado
   * @param data - Data a verificar
   * @returns Promise<Feriado | null> - Feriado encontrado ou null
   */
  async ehFeriado(data: Date): Promise<Feriado | null> {
    const ano = data.getFullYear();
    const feriadosAno = await this.obterFeriados(ano);
    
    // Formata a data para YYYY-MM-DD
    const dataFormatada = data.toISOString().split('T')[0];
    
    // Busca o feriado
    const feriado = feriadosAno.find(f => f.date === dataFormatada);
    return feriado || null;
  }

  /**
   * Obtém o nome de um feriado numa data específica
   * @param data - Data a verificar
   * @returns Promise<string | null> - Nome do feriado ou null
   */
  async obterNomeFeriado(data: Date): Promise<string | null> {
    const feriado = await this.ehFeriado(data);
    return feriado ? feriado.localName : null;
  }
}

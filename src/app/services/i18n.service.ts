import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface para estrutura de traduções
 */
interface Translations {
  [key: string]: any;
}

/**
 * Service responsável pela gestão de strings e traduções
 * Carrega strings de ficheiros JSON e fornece métodos para aceder a essas strings
 */
@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translations: Translations = {};
  private currentLanguage: string = 'pt';
  private translationsLoaded: boolean = false;

  constructor(private http: HttpClient) {
    this.loadTranslations();
  }

  /**
   * Carrega as traduções do ficheiro JSON
   */
  private loadTranslations(): void {
    const translationFile = `assets/i18n/${this.currentLanguage}.json`;
    
    this.http.get<Translations>(translationFile)
      .pipe(
        catchError(() => {
          // Em caso de erro, retorna objeto vazio
          console.warn('Erro ao carregar traduções, usando strings padrão');
          return of({});
        })
      )
      .subscribe(translations => {
        this.translations = translations;
        this.translationsLoaded = true;
      });
  }

  /**
   * Obtém uma string traduzida pelo caminho (ex: 'categorias.titulo')
   * @param key - Caminho da chave (ex: 'categorias.titulo' ou 'common.cancelar')
   * @param params - Parâmetros opcionais para substituir placeholders (ex: {nome: 'Teste'})
   * @returns string - String traduzida ou a chave se não encontrada
   */
  get(key: string, params?: { [key: string]: string }): string {
    if (!this.translationsLoaded) {
      // Se as traduções ainda não foram carregadas, retorna a chave
      return key;
    }

    const keys = key.split('.');
    let value: any = this.translations;

    // Navega pelo objeto usando as chaves
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Se não encontrar, retorna a chave original
        return key;
      }
    }

    // Se o valor encontrado é uma string, substitui parâmetros se fornecidos
    if (typeof value === 'string') {
      if (params) {
        let result = value;
        for (const paramKey in params) {
          result = result.replace(`{${paramKey}}`, params[paramKey]);
        }
        return result;
      }
      return value;
    }

    // Se não for string, retorna a chave
    return key;
  }

  /**
   * Verifica se as traduções foram carregadas
   * @returns boolean - true se as traduções foram carregadas
   */
  isLoaded(): boolean {
    return this.translationsLoaded;
  }
}

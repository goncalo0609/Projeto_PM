import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../services/categoria.service';
import { ProjetoService } from '../services/projeto.service';
import { TarefaService } from '../services/tarefa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  /** Número de categorias */
  totalCategorias: number = 0;
  
  /** Número de projetos */
  totalProjetos: number = 0;
  
  /** Número total de tarefas */
  totalTarefas: number = 0;
  
  /** Número de tarefas em atraso */
  tarefasAtraso: number = 0;

  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    private projetoService: ProjetoService,
    private tarefaService: TarefaService
  ) {}

  /**
   * Inicializa a página carregando os dados
   */
  async ngOnInit() {
    await this.carregarDados();
  }

  /**
   * Carrega os dados para exibir nos badges
   */
  async carregarDados() {
    try {
      // Carrega categorias
      const categorias = await this.categoriaService.getAll();
      this.totalCategorias = categorias.length;

      // Carrega projetos
      const projetos = await this.projetoService.getAll();
      this.totalProjetos = projetos.length;

      // Carrega tarefas
      const tarefas = await this.tarefaService.getAll();
      this.totalTarefas = tarefas.length;
      this.tarefasAtraso = tarefas.filter(t => t.emAtraso).length;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  /**
   * Navega para a página de categorias
   */
  navegarParaCategorias() {
    this.router.navigate(['/categorias']);
  }

  /**
   * Navega para a página de projetos
   */
  navegarParaProjetos() {
    this.router.navigate(['/projetos']);
  }

  /**
   * Navega para a página de tarefas
   */
  navegarParaTarefas() {
    this.router.navigate(['/tarefas']);
  }

  /**
   * Navega para a página de calendário
   */
  navegarParaCalendario() {
    this.router.navigate(['/calendario']);
  }

  /**
   * Atualiza os dados quando a página é visualizada novamente
   * Útil quando o utilizador volta de outras páginas
   */
  async ionViewWillEnter() {
    await this.carregarDados();
  }

}

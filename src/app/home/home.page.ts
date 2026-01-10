import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router: Router) {}

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

}

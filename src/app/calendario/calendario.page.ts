import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { TarefaService } from '../services/tarefa.service';
import { ProjetoService } from '../services/projeto.service';
import { FeriadoService } from '../services/feriado.service';
import { Tarefa } from '../models/tarefa.model';
import { Projeto } from '../models/projeto.model';

/**
 * Interface para representar um dia no calendário
 */
interface DiaCalendario {
  /** Data do dia */
  data: Date;
  /** Número do dia */
  numero: number;
  /** Indica se é do mês atual */
  ehMesAtual: boolean;
  /** Indica se é hoje */
  ehHoje: boolean;
  /** Tarefas deste dia */
  tarefas: Tarefa[];
  /** Quantidade de tarefas em atraso */
  tarefasAtraso: number;
  /** Nome do feriado (se for feriado) */
  feriado?: string | null;
}

/**
 * Página de calendário
 * Exibe tarefas organizadas por data em formato de calendário mensal
 */
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: false,
})
export class CalendarioPage implements OnInit {
  /** Data atual sendo exibida no calendário */
  dataAtual: Date = new Date();

  /** Grid do calendário (6 semanas x 7 dias) */
  semanas: DiaCalendario[][] = [];

  /** Array com todas as tarefas */
  tarefas: Tarefa[] = [];

  /** Array com todos os projetos */
  projetos: Projeto[] = [];

  /** Flag para indicar se está a carregar dados */
  carregando = false;

  /** Dia selecionado para ver detalhes */
  diaSelecionado: DiaCalendario | null = null;

  /** Nomes dos dias da semana */
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Nomes dos meses */
  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  /** Mapa de feriados (data -> nome do feriado) */
  feriados: Map<string, string> = new Map();

  constructor(
    private tarefaService: TarefaService,
    private projetoService: ProjetoService,
    private feriadoService: FeriadoService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  /**
   * Inicializa a página carregando tarefas e gerando o calendário
   */
  async ngOnInit() {
    await this.carregarDados();
    await this.carregarFeriados();
  }

  /**
   * Carrega tarefas e projetos
   */
  async carregarDados() {
    try {
      this.carregando = true;
      this.projetos = await this.projetoService.getAll();
      this.tarefas = await this.tarefaService.getAll();
      this.gerarCalendario();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Carrega os feriados do ano atual
   */
  async carregarFeriados() {
    try {
      const ano = this.dataAtual.getFullYear();
      const feriados = await this.feriadoService.obterFeriados(ano);
      
      // Cria um mapa com data -> nome do feriado
      this.feriados.clear();
      feriados.forEach(feriado => {
        this.feriados.set(feriado.date, feriado.localName);
      });
      
      // Regenera o calendário para incluir os feriados
      this.gerarCalendario();
    } catch (error) {
      console.error('Erro ao carregar feriados:', error);
    }
  }

  /**
   * Gera o grid do calendário para o mês atual
   */
  gerarCalendario() {
    this.semanas = [];
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();

    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    const diaSemanaPrimeiro = primeiroDia.getDay(); // 0 = Domingo, 6 = Sábado

    // Último dia do mês
    const ultimoDia = new Date(ano, mes + 1, 0);
    const totalDias = ultimoDia.getDate();

    // Último dia do mês anterior
    const ultimoDiaMesAnterior = new Date(ano, mes, 0);
    const totalDiasMesAnterior = ultimoDiaMesAnterior.getDate();

    // Hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let diaAtual = 1;
    let diaAnterior = totalDiasMesAnterior - diaSemanaPrimeiro + 1;

    // Gera 6 semanas
    for (let semana = 0; semana < 6; semana++) {
      const diasSemana: DiaCalendario[] = [];

      for (let dia = 0; dia < 7; dia++) {
        let data: Date;
        let numeroDia: number;
        let ehMesAtual: boolean;

        if (semana === 0 && dia < diaSemanaPrimeiro) {
          // Dias do mês anterior
          data = new Date(ano, mes - 1, diaAnterior);
          numeroDia = diaAnterior;
          ehMesAtual = false;
          diaAnterior++;
        } else if (diaAtual > totalDias) {
          // Dias do mês seguinte
          const diaProximoMes = diaAtual - totalDias;
          data = new Date(ano, mes + 1, diaProximoMes);
          numeroDia = diaProximoMes;
          ehMesAtual = false;
          diaAtual++;
        } else {
          // Dias do mês atual
          data = new Date(ano, mes, diaAtual);
          numeroDia = diaAtual;
          ehMesAtual = true;
          diaAtual++;
        }

        // Normaliza a data (remove horas)
        data.setHours(0, 0, 0, 0);

        // Verifica se é hoje
        const ehHoje = data.getTime() === hoje.getTime();

        // Busca tarefas deste dia
        const tarefasDia = this.obterTarefasPorData(data);
        const tarefasAtraso = tarefasDia.filter(t => t.emAtraso).length;

        // Verifica se é feriado
        const dataFormatada = data.toISOString().split('T')[0];
        const nomeFeriado = this.feriados.get(dataFormatada) || null;

        diasSemana.push({
          data: data,
          numero: numeroDia,
          ehMesAtual: ehMesAtual,
          ehHoje: ehHoje,
          tarefas: tarefasDia,
          tarefasAtraso: tarefasAtraso,
          feriado: nomeFeriado
        });
      }

      this.semanas.push(diasSemana);
    }
  }

  /**
   * Obtém tarefas de uma data específica
   * @param data - Data a buscar
   * @returns Array com tarefas da data
   */
  obterTarefasPorData(data: Date): Tarefa[] {
    return this.tarefas.filter(tarefa => {
      const dataLimite = new Date(tarefa.dataLimite);
      dataLimite.setHours(0, 0, 0, 0);
      return dataLimite.getTime() === data.getTime();
    });
  }

  /**
   * Obtém o nome do mês e ano atual
   * @returns string - Nome do mês e ano (ex: "Janeiro 2026")
   */
  obterNomeMesAno(): string {
    const mes = this.meses[this.dataAtual.getMonth()];
    const ano = this.dataAtual.getFullYear();
    return `${mes} ${ano}`;
  }

  /**
   * Navega para o mês anterior
   */
  async mesAnterior() {
    const anoAtual = this.dataAtual.getFullYear();
    this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() - 1, 1);
    
    // Carrega feriados se mudar de ano
    if (this.dataAtual.getFullYear() !== anoAtual) {
      await this.carregarFeriados();
    } else {
      this.gerarCalendario();
    }
  }

  /**
   * Navega para o mês seguinte
   */
  async mesSeguinte() {
    const anoAtual = this.dataAtual.getFullYear();
    this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 1);
    
    // Carrega feriados se mudar de ano
    if (this.dataAtual.getFullYear() !== anoAtual) {
      await this.carregarFeriados();
    } else {
      this.gerarCalendario();
    }
  }

  /**
   * Vai para o mês atual (hoje)
   */
  irParaHoje() {
    this.dataAtual = new Date();
    this.dataAtual.setDate(1); // Primeiro dia do mês
    this.gerarCalendario();
  }

  /**
   * Seleciona um dia para ver detalhes das tarefas
   * @param dia - Dia selecionado
   */
  selecionarDia(dia: DiaCalendario) {
    if (dia.ehMesAtual && dia.tarefas.length > 0) {
      this.diaSelecionado = dia;
    }
  }

  /**
   * Fecha o painel de detalhes do dia
   */
  fecharDetalhes() {
    this.diaSelecionado = null;
  }

  /**
   * Formata a data para exibição (DD/MM/YYYY)
   * @param data - Data a formatar
   * @returns string - Data formatada
   */
  formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Obtém o nome do projeto pelo ID
   * @param projetoId - ID do projeto
   * @returns string - Nome do projeto ou 'Sem projeto'
   */
  obterNomeProjeto(projetoId: string): string {
    const projeto = this.projetos.find(proj => proj.id === projetoId);
    return projeto ? projeto.nome : 'Sem projeto';
  }

  /**
   * Abre um ActionSheet com opções para a tarefa (visualizar detalhes, editar)
   * @param tarefa - Tarefa selecionada
   * @param event - Evento do clique (para prevenir propagação)
   */
  async mostrarOpcoesTarefa(tarefa: Tarefa, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const actionSheet = await this.actionSheetController.create({
      header: tarefa.titulo,
      buttons: [
        {
          text: 'Ver Detalhes',
          icon: 'eye-outline',
          handler: () => {
            this.verDetalhesTarefa(tarefa);
          }
        },
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.navegarParaEditarTarefa(tarefa);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Mostra os detalhes completos de uma tarefa
   * @param tarefa - Tarefa a visualizar
   */
  async verDetalhesTarefa(tarefa: Tarefa) {
    const projetoNome = this.obterNomeProjeto(tarefa.projetoId);
    const dataFormatada = this.formatarData(new Date(tarefa.dataLimite));
    
    const inputs: any[] = [
      {
        name: 'titulo',
        type: 'text',
        value: tarefa.titulo,
        attributes: {
          readonly: true
        },
        placeholder: 'Título'
      },
      {
        name: 'descricao',
        type: 'textarea',
        value: tarefa.descricao || 'Sem descrição',
        attributes: {
          readonly: true,
          rows: 3
        },
        placeholder: 'Descrição'
      },
      {
        name: 'projeto',
        type: 'text',
        value: projetoNome,
        attributes: {
          readonly: true
        },
        placeholder: 'Projeto'
      },
      {
        name: 'dataLimite',
        type: 'text',
        value: dataFormatada,
        attributes: {
          readonly: true
        },
        placeholder: 'Data Limite'
      }
    ];

    let message = '';
    if (tarefa.emAtraso) {
      message = '⚠ Tarefa em atraso';
    }

    const alert = await this.alertController.create({
      header: 'Detalhes da Tarefa',
      message: message,
      inputs: inputs,
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.navegarParaEditarTarefa(tarefa);
          }
        },
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  /**
   * Navega para a página de tarefas
   * Nota: A edição completa da tarefa será feita na página de tarefas
   * Esta função apenas navega para lá
   * @param tarefa - Tarefa a editar (informação para possível uso futuro)
   */
  navegarParaEditarTarefa(tarefa: Tarefa) {
    // Fecha o painel de detalhes primeiro
    this.fecharDetalhes();
    
    // Navega para a página de tarefas
    // O utilizador pode então procurar e editar a tarefa lá
    this.router.navigate(['/tarefas']);
  }

  /**
   * Mostra o nome do feriado num alert
   * @param nomeFeriado - Nome do feriado a exibir
   * @param event - Evento do clique (para prevenir propagação)
   */
  async mostrarFeriado(nomeFeriado: string | null, event?: Event) {
    if (event) {
      event.stopPropagation(); // Previne que o clique selecione o dia
      event.preventDefault(); // Previne comportamento padrão
    }

    if (!nomeFeriado) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Feriado',
      message: nomeFeriado,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}

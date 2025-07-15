import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanoService } from '../../services/planos.service';
import { ProjetoService } from '../../services/projetos.service';
import { differenceInBusinessDays } from "date-fns";
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent implements OnInit {


  //config
  carregandoPlano = false;

  planos = [];
  planoAtual;

  mostrarNovoProjeto = false;
  novoProjeto = {
    nome: '',
    prioridade: 0,
    lider: '',
    padrinho: '',
    escopo: '',
    IdPlano: '',
    etapas: [
      { letra: 'X', nome: 'Cronograma', responsavel: '', data: '', concluida: false },
      { letra: 'Z', nome: 'Conclusão/Anaálise Crítica', responsavel: '', data: '', concluida: false },
    ]
  };

  mostrarProjeto = false;
  projetoSelecionado = {
    nome: '',
    prioridade: 0,
    lider: '',
    padrinho: '',
    escopo: '',
    IdPlano: '',
    etapas: [
      { letra: 'X', nome: 'Cronograma', responsavel: '', data: '', concluida: false },
      { letra: 'Z', nome: 'Conclusão/Anaálise Crítica', responsavel: '', data: '', concluida: false },
    ]
  };

  novaEtapa = { letra: '', nome: '', responsavel: '', data: '', concluida: false };

  carregandoProjetos = false;
  projetos = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private planoService: PlanoService,
    private projetoService: ProjetoService
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['IdPlano'];
   
      id === undefined ? this.router.navigate(['/']) : this.carregarPlano( id );
    });
  }

  carregarPlano( id: string ): void {
    this.carregandoPlano = true;
    this.planos = [];
    this.planoAtual = {};

    this.planoService.getPlanoPorId( id ).subscribe({
      next: data => {
        //transforma o objeto do firebase em um array
        this.planos = Object.entries( data ).map(e => 
          Object.assign( e[1] )
        );
        //usa o ID corretamente pra cada linha da tabela
        this.planos.map( table => {
          Object.entries( data ).map(e => 
            table.Number == e[1].Number ? table.Id = e[0] : null
          );
        });
        this.carregandoPlano = false;
        this.planoAtual = this.planos[0];
        this.carregarProjetos( this.planoAtual.IdPlano );
      }
    })
  }

  carregarProjetos( IdPlano: string ): void {
    this.projetos = [];
    this.carregandoProjetos = true;
    this.projetoService.getProjetosPorPlano( IdPlano ).subscribe({
      next: data => {
        //transforma o objeto do firebase em um array
        this.projetos = Object.entries( data ).map(e => 
          Object.assign( e[1] )
        );
        //usa o ID corretamente pra cada linha da tabela
        this.projetos.map( table => {
          Object.entries( data ).map(e => 
            table.Number == e[1].Number ? table.Id = e[0] : null
          );
        });
        this.calcularProgressoProjetos();
      }
    })
  }

  calcularProgressoProjetos(): void {
    if( this.projetos.length == 0 ) {
      this.carregandoProjetos = false;
    }
    this.projetos.forEach(( projeto, index ) => {
      projeto.progresso = projeto.etapas.filter( etapa => etapa.concluida ).length / projeto.etapas.length;
      projeto.cronograma = projeto.etapas.filter( etapa => etapa.nome == 'Cronograma' )[0];
      let cronDiff = differenceInBusinessDays( new Date(), new Date(projeto.cronograma.data) ) || +1;
      
      projeto.atraso = cronDiff > 0 ;

      if( index == this.projetos.length - 1 ) {
        this.carregandoProjetos = false;
      }
    });
  }

  janelaVerProjeto( projetoSelecionado ): void {
    this.mostrarProjeto = !this.mostrarProjeto;
    this.mostrarProjeto ? this.projetoSelecionado = projetoSelecionado : null;
  }

  janelaNovoProjeto(): void {
    this.mostrarNovoProjeto = !this.mostrarNovoProjeto;
    if( !this.mostrarNovoProjeto ) {
      this.resetarNovoProjeto();
    }
  }

  resetarNovoProjeto(): void {
    this.novoProjeto = {
      nome: '',
      prioridade: 0,
      lider: '',
      padrinho: '',
      escopo: '',
      IdPlano: '',
      etapas: [
        { letra: 'X', nome: 'Cronograma', responsavel: '', data: '', concluida: false },
        { letra: 'Z', nome: 'Conclusão/Anaálise Crítica', responsavel: '', data: '', concluida: false },
      ],
    };

    this.novaEtapa = { letra: '', nome: '', responsavel: '', data: '', concluida: false };
  }

  adicionarNovaEtapa(): void {
    this.novaEtapa.letra = 'A';
    this.novaEtapa.data = new Date( this.novaEtapa.data ).toISOString();
    this.novoProjeto.etapas.push( this.novaEtapa );
    this.novaEtapa = { letra: '', nome: '', responsavel: '', data: '', concluida: false };
  }

  salvarNovoProjeto(): void {
    this.novoProjeto.IdPlano = this.planoAtual.IdPlano;

    this.projetoService.postProjeto( this.novoProjeto ).subscribe({
      next: result => {
        this.messageService.add({ severity: 'success', summary: 'Novo Plano', detail: 'Salvo!' });
        this.janelaNovoProjeto();
        this.carregarProjetos( this.planoAtual.IdPlano );
      }
    })
  }

}

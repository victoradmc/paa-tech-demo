import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanoService } from '../../services/planos.service';
import { ProjetoService } from '../../services/projetos.service';
import { differenceInBusinessDays } from "date-fns";
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  carregandoPlanos = false;
  carregandoProjetos = false;
  carregandoAcoes = false;

  planos = [];
  projetos = [];
  etapas = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private planoService: PlanoService,
    private projetoService: ProjetoService
  ) {}
  
  ngOnInit(): void {
    this.carregarPlanos();
    this.carregarProjetos();
  }

  carregarPlanos(): void {
    this.carregandoPlanos = true;
    this.planos = [];   

    this.planoService.getPlanos().subscribe({
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
        this.carregandoPlanos = false;
      }
    })
  }

  carregarProjetos() {
    this.projetos = [];
    this.carregandoProjetos = true;

    this.projetoService.getProjetos().subscribe({
      next: async data => {
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
        await this.calcularProgressoProjetos();
        this.carregandoProjetos = false;
        await this.calcularAcoes();
        this.carregandoAcoes = false;
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
      projeto.nomePlano = this.planos.filter( plano => plano.IdPlano == projeto.IdPlano )[0].nome;
    });
  }

  calcularAcoes(): void {
    this.carregandoAcoes = true;

    this.projetos.forEach(( projeto, index ) => {
      projeto.etapas.forEach( etapa => {
        let etapaObj = {
          nome: `${projeto.nomePlano} > ${projeto.nome} > ${etapa.nome}`,
          data: etapa.data,
          atrasado: differenceInBusinessDays( new Date(), new Date(etapa.data) ) || +1,
          responsavel: etapa.responsavel,
        }

        this.etapas.push( etapaObj );
      });
    });
  }

}

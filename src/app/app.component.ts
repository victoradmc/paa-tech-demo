import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { PlanoService } from './services/planos.service';
import { Message, MessageService } from 'primeng/api';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  //autenticacao firebase
  isAuthenticated = false;
  private userSubscription!: Subscription;

  //modal novo plano
  mostrarNovoPlano = false;
  novoPlano = {
    nome: '',
    desafio: '',
    atraves: '',
    IdPlano: '',
    criadoPor: '',
    criadoEm: ''
  }

  planos = [];
  plano1 = [];


  constructor( 
    private authService: AuthService, 
    private planoService: PlanoService,
    private messageService: MessageService ) {

  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !user ? false : true;
      if( this.isAuthenticated ) {
        this.carregarPlanos();
      }
    });

    this.authService.autoLogin();
  }

  carregarPlanos(): void {
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
      }
    })
  }

  janelaNovoPlano(): void {
    this.mostrarNovoPlano = !this.mostrarNovoPlano;

    if( !this.mostrarNovoPlano ) {
      this. novoPlano = {
        nome: '',
        desafio: '',
        atraves: '',
        IdPlano: '',
        criadoPor: '',
        criadoEm: ''
      }
    }
  }

  salvarNovoPlano(): void {
    this.novoPlano.IdPlano = uuidv4();
    this.novoPlano.criadoEm = new Date().toISOString();
    this.novoPlano.criadoPor = JSON.parse( localStorage.getItem('userData') ).email

    this.planoService.postPlano( this.novoPlano ).subscribe({
      next: result => {
        this.messageService.add({ severity: 'success', summary: 'Novo Plano', detail: 'Salvo!' });
        this.carregarPlanos();
        this.janelaNovoPlano();
      }, 
      error: err => {
        console.log( err );
        this.janelaNovoPlano();
      }
    })
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

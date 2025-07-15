import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ProjetoService {


  constructor( private http: HttpClient ) { }

  postProjeto( novoProjeto ) {
     return this.http.post(
      'https://paa-tech-demo-default-rtdb.firebaseio.com/projetos.json',
      novoProjeto
    )
  }

  getProjetos(){
    return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/projetos.json?print=pretty`)
  }

  getProjetosPorPlano( IdPlano: string ) {
    return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/projetos.json?orderBy="IdPlano"&equalTo="${IdPlano}"`)
  }

  getProjetoPorId( id: string ) {
    return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/projetos.json?orderBy="IdProjeto"&equalTo="${id}"`)
  }




}
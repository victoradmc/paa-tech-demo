import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PlanoService {


  constructor( private http: HttpClient ) { }

  postPlano( novoPlano ) {
     return this.http.post(
      'https://paa-tech-demo-default-rtdb.firebaseio.com/planos.json',
      novoPlano
    )
  }

  getPlanos() {
    return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/planos.json?print=pretty`)
  }

  getPlanoPorId( id: string ) {
    return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/planos.json?orderBy="IdPlano"&equalTo="${id}"`)
  }

  // plano1() {
  //   return this.http.get(`https://paa-tech-demo-default-rtdb.firebaseio.com/planos.json?orderBy="nome"&equalTo="Plano 1"`)
  // }

}
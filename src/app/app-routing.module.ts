import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//paginas
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlanosComponent } from './components/planos/planos.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' }},
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: 'plano', component: PlanosComponent, data: { title: 'Plano' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

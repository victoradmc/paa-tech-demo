//config e setup
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';

//firebase e autenticação
import { AuthInterceptor } from './services/auth-interceptor.interceptor';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'


//primeng e bibliotecas
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
//Componentes
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PlanosComponent } from './components/planos/planos.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    DashboardComponent,
    SpinnerComponent,
    PlanosComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
    InputNumberModule,
    DividerModule,
    BadgeModule,
    DialogModule,
    StyleClassModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    ProgressSpinnerModule,
    AppRoutingModule
  ],
  providers: [ 
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

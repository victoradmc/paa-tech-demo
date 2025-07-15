import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  }

  constructor( private authService: AuthService, private messageService: MessageService, private router: Router ) {  }

  handleLogin(): void {
    this.authService.login( this.user.email, this.user.password ).subscribe({
      next: ( response ) => {
        this.router.navigate(['/']);
      }, 
      error: ( errorMessage ) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

}

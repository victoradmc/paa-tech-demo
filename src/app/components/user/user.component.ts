import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSubscription!: Subscription;

  constructor( private authService: AuthService ) {

  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !user ? false : true;
    });

    this.authService.autoLogin();

    
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

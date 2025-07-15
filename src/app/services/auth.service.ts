import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, catchError, throwError, tap, BehaviorSubject } from 'rxjs';

import { User } from '../models/user.models';
import { Router } from '@angular/router';


interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>( null );
  isLoggedIn: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    public http: HttpClient,
    public router: Router
  ) { }

  signUp( email: string, password: string ) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ environment.firebaseConfig.apiKey }`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe( 
      catchError( this.handleError ), 
      tap( response => {
        this.handleAuthentication(
          response.email, 
          response.localId,
          response.idToken,
          +response.expiresIn)
      })
    );
  }

  login( email: string, password: string ) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ environment.firebaseConfig.apiKey }`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe( 
      catchError( this.handleError ), 
      tap( response => {
        this.handleAuthentication(
          response.email, 
          response.localId,
          response.idToken,
          +response.expiresIn
        )
      })
    );
  }

  logout(): void {
    this.user.next( null );
    this.isLoggedIn = false;
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  private handleAuthentication( email: string, userId: string, token: string, expiresIn: number ) {
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000 );

    const user = new User ( email, userId, token, expirationDate );

    this.isLoggedIn = true;

    this.user.next( user );

    localStorage.setItem( 'userData', JSON.stringify( user ) );
  }

  autoLogin(): void {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse( localStorage.getItem('userData') );
    
    if ( !userData || userData == null ) {
      this.logout();
      return null;
    }
    const loadedUser = new User( userData.email, userData.id, userData._token, new Date( userData._tokenExpirationDate ) );
    this.isLoggedIn = true;
    loadedUser.token ? this.user.next( loadedUser ) : this.logout();
  }

  private handleError( errorResponse: HttpErrorResponse ) {
    let errorMessage = 'An Unknown error occurred!';
      if ( !errorResponse.error || !errorResponse.error.error ) {
        return throwError(() =>  errorMessage );
      }
      switch ( errorResponse.error.error.message ) {
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMessage = 'Email or Password invalid';
          break;
        case 'USER_DISABLED':
          errorMessage = 'Please contact an administrator';
          break;
        case 'EMAIL_EXISTS':
          errorMessage = 'This email is already registered.';
          break;
      }

      return throwError(() => new Error( errorMessage ));
  }

}

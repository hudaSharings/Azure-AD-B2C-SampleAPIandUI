import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  isAuthenticated: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = false;
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  debugger;
   const urlParams = new URLSearchParams(window.location.hash);
    //Setting token in session storage to prevent immediate multiple redirection to AAD login.
    let id_token=urlParams.get('id_token')
    if (id_token ) {
      window.sessionStorage.setItem('msal.idtoken', urlParams.get('id_token'));
    }

    const token: string = this.authService.getToken();
    if (token === null || token === undefined || token === 'null'|| token === "") {
      this.router.navigate(['/authentication']);
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
    return this.isAuthenticated;
  }
}

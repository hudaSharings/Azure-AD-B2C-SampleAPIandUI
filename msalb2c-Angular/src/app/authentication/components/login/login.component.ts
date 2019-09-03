import { Component, OnInit } from '@angular/core';
import { MSALService } from '../../service/msal.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'ccw-auth',
  template: `<span> <p>Token: {{token}}</p>
  <p>{{info | json}}</p>
 <hr/>
  <input type="button" (click)="logIn()" value="logIn" />
  <input type="button" (click)="logout()" value="logOut" />  
  </span>`
})
export class LoginComponent implements OnInit {
  
  token:string;
  info:string;
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    debugger
    const token: string = this.authService.getToken();
    if (token === null || token === undefined || token === 'null') {
      this.authService.login();
    }   
    this.token=this.authService.getToken();
    this.info= JSON.stringify(this.authService.getTokenDecoded());
  }
  logout(){
    this.authService.logOut();
  }
  logIn(){    
    this.authService.login();
  }

}

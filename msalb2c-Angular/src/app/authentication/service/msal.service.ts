import { Injectable } from '@angular/core';
import { UserAgentApplication } from 'msal';
import { environment } from '../../../environments/environment';

@Injectable()
export class MSALService {    
    private applicationConfig: any = {
        clientID: '{{Client Id}}',
        authority: 'https://login.microsoftonline.com/tfp/{{ Tenant}}.onmicrosoft.com/',
        signInsignUp:'B2C_1_signIn_signUp',
        reserPassword:'B2C_1_PasswordReset',
        b2cScopes: ['https://{{ Tenant}}.onmicrosoft.com/user.read'],
        redirectUrl: 'http://localhost:4200',
        extraQueryParameter: 'p=B2C_1_signIn_signUp&scope=openid&nux=1'
    };

    private app: any;
    public user: any;
    public IsResetPassword:boolean;
    constructor() {
        this.InitAuthorize();
    }
    public InitAuthorize() {
        debugger;
        this.getErroDescFromURL();
        let authority: string
        if (this.IsResetPassword) {           
            authority = this.applicationConfig.authority+this.applicationConfig.reserPassword;            
        } else {            
            authority = this.applicationConfig.authority+this.applicationConfig.signInsignUp;
        }

        this.app = new UserAgentApplication(
            this.applicationConfig.clientID,
            authority,
            (errorDesc: string, token: string, error: string, tokenType: string)=>{
            debugger
            this.tokenReceviedCallback(errorDesc, token, error, tokenType)
            },
            {redirectUri: this.applicationConfig.redirectUrl}
            );

    }
    private initiateUserAgentApplication(policy:string):UserAgentApplication{
        return new UserAgentApplication(
            this.applicationConfig.clientID,
            this.applicationConfig.authority+policy,
            (errorDesc: string, token: string, error: string, tokenType: string)=>{
            debugger
            this.tokenReceviedCallback(errorDesc, token, error, tokenType)
            },
            {redirectUri: this.applicationConfig.redirectUrl}
            );
    }

    private tokenReceviedCallback(errorDesc: string, token: string, error: string, tokenType: string){
    debugger
        
    }

    public login() {
        if(this.IsResetPassword)
        {
        this.app=this.initiateUserAgentApplication(this.applicationConfig.reserPassword)      
        }else{
            this.app=this.initiateUserAgentApplication(this.applicationConfig.signInsignUp)
        }
        let tokenData = '';
        this.app.loginRedirect(this.applicationConfig.b2cScopes).then(data => { tokenData = data; });
    }
    public getErroDescFromURL(){
        const urlParams = new URLSearchParams(window.location.hash);
        let errorDesc=urlParams.get('error_description')
        if (errorDesc !== null ||errorDesc !== undefined|| errorDesc !== '') {
            if (errorDesc && errorDesc.indexOf('AADB2C90118') > -1) {
               this.IsResetPassword=true;        
            }
          }else{
            this.IsResetPassword=false;
          }
        

    }


    public getUser() {
        const user = this.app.getUser();
        if (user) {
            return user;
        } else {
            return null;
        }
    }

    public logout() {
        this.app.logout();
    }

    public getToken() {
        return this.app.acquireTokenSilent(this.applicationConfig.b2cScopes)
            .then(accessToken => {
                console.log(accessToken);
                return accessToken;
            }, error => {
                return this.app.acquireTokenPopup(this.applicationConfig.b2cScopes)
                    .then(accessToken => {
                        return accessToken;
                    }, err => {
                        console.error(err);
                    });
            });
    }
}

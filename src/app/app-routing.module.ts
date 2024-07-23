import { ModuleWithProviders, Injectable } from '@angular/core'
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InstallationPageComponent } from './installation/pages';
import { ExplorerPageComponent } from './explorer/pages';
import {
  AccountPageComponent,
  SignInPageComponent,
  AcceptInvitationPageComponent,
  PasswordResetPageComponent
} from './account/pages';
import { environment } from '../environments/environment';

import { AuthGuard } from './app.guards';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  access_token: string;
  client: string;
  expiry: string;
  token_type: string;
  uid: string;

  constructor(
    private route: ActivatedRoute
  ){
    //try to retrieve credentials from local storage
    this.access_token = localStorage.getItem('auth.access-token') ?? ''
    this.client = localStorage.getItem('auth.client') ?? ''
    this.expiry = localStorage.getItem('auth.expiry') ?? ''
    this.token_type = localStorage.getItem('auth.token-type') ?? ''
    this.uid = localStorage.getItem('auth.uid') ?? ''
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //check for the access-token in the parameters (from reset password request)
    let params = this.route.snapshot.queryParams
    if(params["access-token"]!=null){
      this.access_token = params["access-token"]
      this.client = params["client"]
      this.expiry = params["expiry"]
      this.token_type = params["token-type"]
      this.uid = params["uid"]
    }

    request = request.clone({
      url: environment.apiUrl+'/'+request.url,
      setHeaders: {
        'access-token': this.access_token==null?'':this.access_token,
        'client': this.client==null?'':this.client,
        'expiry': this.expiry==null?'':this.expiry,
        'token-type': this.token_type==null?'':this.token_type,
        'uid': this.uid==null?'':this.uid
      }
    });
    return next.handle(request).pipe(tap(event => {
      if(event instanceof HttpResponse){
        //save the authentication credentials
        this.access_token = event.headers.get('access-token') ?? '';
        localStorage.setItem('auth.access-token',this.access_token);
        this.client = event.headers.get('client') ?? '';
        localStorage.setItem('auth.client',this.client);
        this.expiry = event.headers.get('expiry') ?? '';
        localStorage.setItem('auth.expiry',this.expiry);
        this.token_type = event.headers.get('token-type') ?? '';
        localStorage.setItem('auth.token_type',this.token_type);
        this.uid = event.headers.get('uid') ?? '';
        localStorage.setItem('auth.uid',this.uid);
      };
    }));
  }
}

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'explorer',
    pathMatch: 'full',
    //canActivate: [AuthGuard]
  },
  {
    path: 'explorer',
    component: ExplorerPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'installations/:id',
    component: InstallationPageComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'session/sign_in',
    component: SignInPageComponent
  },
  {
    path: 'session/reset_password',
    component: PasswordResetPageComponent
  },
  {
    path: 'accept',
    component: AcceptInvitationPageComponent
  },
  {
    path: '**',
    redirectTo: 'explorer',
  },

];

export const appRoutes: ModuleWithProviders<RouterModule> =
  RouterModule.forRoot(routes);

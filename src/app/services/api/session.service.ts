import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable, empty} from 'rxjs';
import { share } from 'rxjs/operators';
import { Store } from '@ngrx/store'

import { environment } from '../../../environments/environment';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { parseDeviseErrors } from './helpers';
import { IAppState } from '../../app.store'
import {
  setCurrentUser
} from '../../store/data/actions';

import * as uiActions from 'app/store/ui/actions';
import { defaultUser } from 'app/store/data/initial-state';
import { IUser } from 'app/store/data/types';

@Injectable()
export class SessionService {

  private settingsLoaded: boolean;

  constructor(
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.settingsLoaded = false;
   }


  public login(email: string, password: string): Observable<any> {
    let o = this.http.post<schema.IApiResponse>('auth/sign_in',
    { "email": email, "password": password }).pipe(share())

    o.subscribe(
      json => {
        this.setUser(json.data)
        this.router.navigate(['/explorer']);
        this.messageService.clearMessages();
      },
      error => this.messageService.setErrors(parseDeviseErrors(error))
    );
    return o; //for other subscribers
  }


  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
    this.messageService.setNotice('You are logged out');
  }

  public updateAccount(accountParams: any) {
    this.http.put<schema.IApiResponse>('auth.json', accountParams)
      .subscribe(
      json => {
        this.setUser(json.data);
        this.messageService.setNotice("account updated");
      },
      resp => {
        this.messageService.setErrors(parseDeviseErrors(resp))
      })
  }

  public resetPassword(email: string): Observable<any> {
    if(email.length == 0){
      this.messageService.setError("enter an e-mail address");
      return empty();
    }
    let o = this.http.post('auth/password.json',{ 
      email: email,
      redirect_url: `${window.location.origin}/session/reset_password` })
      .pipe(share());

    o.subscribe(
      _ => this.messageService.setNotice("sent e-mail with password reset"),
      _ => this.messageService.setError("error sending password reset")
      );
    return o;
  }

  public updatePassword(
    password: string,
    passwordConfirmation: string
  ): void {
    this.http.put('auth/password',
      {
        password: password,
        password_confirmation: passwordConfirmation
      })
      .subscribe(
      _ => this.router.navigate(['/explorer']),
      resp => this.messageService.setErrors(parseDeviseErrors(resp)));
  };

  public validateToken(): void {
    this.http.get<schema.IApiResponse>('auth/validate_token')
      .subscribe(
      json => this.setUser(json.data),
      error => this.logout())
  }

  public retrieveSiteSettings(): void{
    if(this.settingsLoaded)
      return;
    this.http.get<schema.ISiteSettings>('index.json')
    .subscribe(
      json => this.updateSiteSettings(json)
    );
  }

  // ----------private helper functions----------

  private setUser(json) {
    let user:IUser = {...defaultUser, ...json}
    this.store.dispatch(setCurrentUser({user}));
  }

  private updateSiteSettings(data: schema.ISiteSettings){
    this.store.dispatch(uiActions.setPageHeader({header: data.node_name}));
    this.store.dispatch(uiActions.enableEmails({enable: data.send_emails}));
    this.settingsLoaded=true;
  }
}
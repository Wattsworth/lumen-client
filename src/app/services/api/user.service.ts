import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import * as types  from '../../store/data/types';
import {entityFactory, defaultUser} from '../../store/data/initial-state';
import * as schema from '../../api';
import {map} from 'rxjs/operators';
import { IUsersAuthTokenGET } from './json-types';
import { 
  receiveUser, 
  installationTokensUnavailable, 
  receiveUserInstallationToken } from '../../store/data/actions'
import {
  MessageService
} from '../message.service';


@Injectable()
export class UserService {

  private usersLoaded: boolean;

  constructor(
    //private http: Http,
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService,
    private router: Router
  ) {
    this.usersLoaded = false;
  }

  public loadUsers(): void {
    //only execute request once
    if (this.usersLoaded)
      return;
    this.http
      .get('users.json', {}).pipe(
        map(json => normalize(json, schema.users).entities))
      .subscribe({
      next: (entities) => {
        let users: types.IUser[] = entityFactory(entities['users'], defaultUser)
        this.store.dispatch(receiveUser({users}))
        this.usersLoaded = true;
      },
      error: (error) => this.messageService.setErrorsFromAPICall(error)
    });
  }

  public requestInstallationToken(): void{
    this.http
      .post<IUsersAuthTokenGET>('users/auth_token.json',{})
      .subscribe({
      next: (data) => {
        this.store.dispatch(receiveUserInstallationToken({token: data.key}));
      },
      error: (error) => {
        this.store.dispatch(installationTokensUnavailable());
      }
    })
  }

  public acceptInvitation(userParams: any, token: string): void {
    userParams['invitation_token'] = token;
    this.http
      .put(`auth/invitation.json`, userParams)
      .subscribe(
      json => {
        localStorage.clear();
        this.router.navigate(['/']);
        this.messageService.setNotice('Welcome to Wattsworth, please log in');
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }
}

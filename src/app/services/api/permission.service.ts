
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createSelector, Store, select } from '@ngrx/store';
import { normalize } from 'normalizr';
import * as schema from '../../api';
import { IPermission} from '../../store/data';
import * as actions from '../../store/data/actions';
import { UserService } from './user.service';
import { UserGroupService } from './user-group.service';

import {
  MessageService
} from '../message.service';
import { users_, userGroups_ } from '../../selectors';
import { defaultPermission, entityFactory } from '../../store/data/initial-state';


@Injectable()
export class PermissionService {

  users$ = this.store.pipe(select(createSelector(users_,state=>state.entities)));
  userGroups$ = this.store.pipe(select(createSelector(userGroups_,state=>state.entities)));

  public targets$: Observable<PermissionTarget[]>;

  private nilmsWithPermissions: number[];

  constructor(
    //private http: Http,
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService,
    private userService: UserService,
    private userGroupService: UserGroupService
  ) {
    //keep track of NILM's we retrieve permissions for
    this.nilmsWithPermissions = [];

    
    this.targets$ = combineLatest([this.users$, this.userGroups$]).pipe(
      map(([users, userGroups]) => {
        let targets: PermissionTarget[] = []
        Object.keys(users).reduce((acc: PermissionTarget[], id) => {
          let user = users[id];
          acc.push({
            id: +id,
            name: `${user.first_name} ${user.last_name}`,
            type: 'user'
          })
          return acc;
        }, targets)
        Object.keys(userGroups).reduce((acc: PermissionTarget[], id) => {
          let group = userGroups[id];
          acc.push({
            id: +id,
            name: `${group.name}`,
            type: 'group'
          })
          return acc;
        }, targets)
        return targets;
      }));
  }

  public loadPermissions(nilmId: number): void {
    //don't retrieve permissions if we already loaded them
    if (this.nilmsWithPermissions.indexOf(nilmId) > -1) {
      return;
    }
    this.http
      .get('permissions.json', { 
        params: new HttpParams().set('nilm_id', nilmId.toString()) })
      .subscribe(
      json => {
        this.nilmsWithPermissions.push(nilmId);
        let entities = normalize(json, schema.permissions).entities;
        let permissions = entityFactory(entities['permissions'], defaultPermission);
        this.store.dispatch(actions.receivePermission({permissions}));
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }

  public removePermission(permission: IPermission): void {
    this.http
      .delete<schema.IApiResponse>(`permissions/${permission.id}.json`, { 
        params: new HttpParams().set('nilm_id', permission.nilm_id.toString()) })
      .subscribe(
      json => {
        this.store.dispatch(actions.removePermission({id: permission.id}))
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }

  public createPermission(
    nilmId: number,
    role: string,
    targetId: number,
    targetType: string): Observable<schema.IApiResponse> {
    let o = this.http
      .post<schema.IApiResponse>('/permissions.json', {
        nilm_id: nilmId,
        role: role,
        target: targetType,
        target_id: targetId
      }).pipe(share());

    o.subscribe(
      json => {
        let entities = normalize(json, schema.permissions).entities;
        let permissions = entityFactory(entities['permissions'], defaultPermission);
        this.store.dispatch(actions.receivePermission({permissions}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  public createUserWithPermission(
    nilmId: number,
    role: string,
    userParams: any
  ) {
    let o = this.http
      .put<schema.IApiResponse>(`permissions/create_user.json`,
      Object.assign({}, userParams,
        {
          nilm_id: nilmId,
          role: role,
        })).pipe(share());

    o.subscribe(
      json => {
        let entities = normalize(json.data, schema.permission).entities;
        let permissions = entityFactory(entities['permissions'], defaultPermission);
        this.store.dispatch(actions.receivePermission({permissions}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  public inviteUserWithPermission(
    nilmId: number,
    role: string,
    email: string) {
    let o = this.http
      .put<schema.IApiResponse>(`permissions/invite_user.json`, {
        email: email,
        nilm_id: nilmId,
        role: role,
        redirect_url: `${window.location.origin}/accept`
      }).pipe(share());

      o.subscribe(
      json => {
        let entities = normalize(json.data, schema.permission).entities;
        let permissions = entityFactory(entities['permissions'], defaultPermission);
        this.store.dispatch(actions.receivePermission({permissions}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
      return o;
  }

  public loadTargets(): void {
    this.userService.loadUsers();
    this.userGroupService.loadUserGroups();
  }
}

export interface PermissionTarget {
  id: number,
  name: string,
  type: string
}
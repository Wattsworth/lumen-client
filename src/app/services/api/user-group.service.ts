import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { share } from 'rxjs/operators';
import { normalize } from 'normalizr';
import * as schema from '../../api';

import {IUserGroupsGET} from './json-types'

import {
  IUser,
  IUserGroup
} from '../../store/data';
import * as actions from '../../store/data/actions'

import {
  MessageService
} from '../message.service';
import { defaultUserGroup, defaultUser, entityFactory } from '../../store/data/initial-state';


@Injectable()
export class UserGroupService {

  private groupsLoaded: boolean;

  constructor(
    //private http: Http,
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService
  ) {
    this.groupsLoaded = false;
  }

  public loadUserGroups(): Observable<any> {
    //only execute request once
    if (this.groupsLoaded) {
      return EMPTY;
    }

    let o = this.http
      .get<IUserGroupsGET>('user_groups.json', {}).pipe(share());

    o.subscribe({
      next: (json: IUserGroupsGET) => {
        this.groupsLoaded = true;
        //load owned groups (contains user data)
        let entities = normalize(json['owner'], schema.userGroups).entities;
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveOwnerGroups({groups}))
        
        if (entities['users'] !== undefined) {
          let users = entityFactory(entities['users'], defaultUser)
          this.store.dispatch(actions.receiveUser({users}))
        }
        //load member groups
        entities = normalize(json['member'], schema.userGroups).entities;
        groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveMemberGroups({groups}))
        
        //load other groups (generic action)
        entities = normalize(json['other'], schema.userGroups).entities;
        groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}))
        
      },
      error: (error) => this.messageService.setErrorsFromAPICall(error),
    });
    return o;
  }

  public removeMember(group: IUserGroup, member: IUser) {
    this.http
      .put<schema.IApiResponse>(`user_groups/${group.id}/remove_member.json`, { user_id: member.id })
      .subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}))
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }

  public addMember(group: IUserGroup, member: IUser) {
    this.http
      .put<schema.IApiResponse>(`user_groups/${group.id}/add_member.json`, { user_id: member.id })
      .subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }

  public inviteMember(group: IUserGroup, email: string) {
    this.http
      .put<schema.IApiResponse>(`user_groups/${group.id}/invite_member.json`, {
        email: email,
        redirect_url: `${window.location.origin}/accept`
      })
      .subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      );
  }



  public createMember(group: IUserGroup, userParams: any) {
    let o = this.http
      .put<schema.IApiResponse>(`user_groups/${group.id}/create_member.json`, userParams)
      .pipe(share());
    o.subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}));
        if (entities['users'] !== undefined) {
          let users = entityFactory(entities['users'], defaultUser);
          this.store.dispatch(actions.receiveUser({users}));
        }
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  public createGroup(name: string, description: string): Observable<any> {
    let o = this.http
      .post<schema.IApiResponse>('user_groups.json', {
        name: name,
        description: description
      })
      .pipe(share())

    o.subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveOwnerGroups({groups}))
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    )
    return o; //for other subscribers
  }

  public updateGroup(
    group: IUserGroup,
    name: string,
    description: string): Observable<any> {
    let o = this.http
      .put<schema.IApiResponse>(`user_groups/${group.id}.json`, {
        name: name, description: description
      })
      .pipe(share());
    o.subscribe(
      json => {
        let entities = normalize(json.data, schema.userGroup).entities
        let groups = entityFactory(entities['user_groups'], defaultUserGroup);
        this.store.dispatch(actions.receiveGroups({groups}))
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    )
    return o; //for other subscribers
  }

  public destroyGroup(group: IUserGroup) {
    this.http
      .delete<schema.IApiResponse>(`user_groups/${group.id}.json`)
      .subscribe(
      json => {
        this.store.dispatch(actions.removeUserGroup({id: group.id}));
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      )
  }

}

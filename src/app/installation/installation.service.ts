import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators'

import { normalize } from 'normalizr';

import * as schema from '../api';

import * as uiActions from './store/actions';
import * as appActions from '../store/data/actions';
import {defaultDataApp, entityFactory} from '../store/data/initial-state'
import {

  INilm,
  IDbFolder,
  IDbStream,
  IDbElement
} from '../store/data';
import { 
  NilmService,
  MessageService 
} from '../services/';
import { HttpClient } from '@angular/common/http';
import { InstallationSelectors } from './installation.selectors';

@Injectable()
export class InstallationService {

  constructor(
    private store: Store,
    private messageService: MessageService,
    private nilmService: NilmService,
    private installationSelectors: InstallationSelectors,
    private http: HttpClient
  ) { }

  // ---selectDbRoot: pick the root from tree -----
  public selectDbRoot() {
    console.log("ERROR: SELECT DB ROOT NOT IMPLEMENTED")
    this.store.dispatch(uiActions.selectDbRoot());
  }

  // ---selectDbFolder: pick folder from tree -----
  public selectDbFolder(id: number) {
    this.store.dispatch(uiActions.selectDbFolder({id}));
    this.messageService.clearMessages();
  }

  // ---selectDbStream: pick a stream from tree---
  public selectDbStream(id: number) {
    this.store.dispatch(uiActions.selectDbStream({id}));
    this.messageService.clearMessages();
  }

  // ---selectEventStream: pick event stream from tree -----
  public selectEventStream(id: number) {
    this.store.dispatch(uiActions.selectEventStream({id}));
    this.messageService.clearMessages();
  }

  // ---selectJouleModule: pick an interface from tree---
  public selectDataApp(id: number){
    this.http
      .get(`app/${id}.json`)
      .subscribe(
      json => {
        let entities = normalize(json, schema.dataApp).entities;
        let apps = entityFactory(entities['dataApps'], defaultDataApp);
        this.store.dispatch(appActions.receiveDataApp({apps}));
      })
      this.store.dispatch(uiActions.selectDataApp({id}));;
    this.messageService.clearMessages();
  }

  // ---setNilm: work on specified NILM -----
  public setNilm(id: number) {
    // set the new db id
    this.store.dispatch(uiActions.setNilm({id}));;
  }

  // ---refreshInstallation: refresh current installation ----
  public refresh(){
    this.store.dispatch(uiActions.refreshing());
    let nilm_id:number
    this.installationSelectors.nilm_id$.pipe(take(1)).subscribe(id => nilm_id=id);
    this.nilmService.refreshNilm(nilm_id).subscribe({
      next: success => this.store.dispatch(uiActions.refreshed()),
      error: error => this.store.dispatch(uiActions.refreshed()),
    });
  }

  // ---expandNode: expand a node in the tree -----
  public expandNode(id: string) {
    this.store.dispatch(uiActions.expandNode({id}));
  };

  // ---collapseNode: collapse a node in the tree -----
  public collapseNode(id: string) {
    this.store.dispatch(uiActions.collapseNode({id}));
  }

}

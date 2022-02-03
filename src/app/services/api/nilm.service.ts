import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { Store } from '@ngrx/store'
import { share } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { normalize } from 'normalizr';
import * as schema from '../../api';

import { IAppState } from '../../app.store';
import { INilm } from '../../store/data';
import * as actions from '../../store/data/actions';

import {
  MessageService
} from '../message.service';
import { defaultDataApp, defaultDbFolder, defaultNilm, entityFactory } from 'app/store/data/initial-state';


@Injectable()
export class NilmService {

  private nilmsLoaded: boolean;

  constructor(
    //private http: Http,
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService
  ) {
    this.nilmsLoaded = false;
  }

  public loadNilms(): Observable<any> {
    if (this.nilmsLoaded) {
      return EMPTY;
    }

    let o = this.http
      .get('nilms.json', {})
      .pipe(share())

    o.subscribe(
      json => {
        this.nilmsLoaded = true;
        let data = normalize(json, schema.nilms)
        this._dispatch(data.entities);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o; //for other subscribers
  }

  public loadNilm(id: number): Observable<any> {
    let o = this.http
      .get<schema.IApiResponse>(`nilms/${id}.json`, {})
      .pipe(share());

    o.subscribe(
      json => {
        let data = normalize(json.data, schema.nilm)
        this._dispatch(data.entities);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o; //for other subscribers
  }

  public updateNilm(
    nilm: INilm,
    name: string,
    description: string,
    url: string,
    max_points_per_plot: number,
    max_events_per_plot: number) {
    this.http.put<schema.IApiResponse>(`nilms/${nilm.id}.json`, {
      name: name,
      description: description,
      url: url,
      max_points_per_plot: max_points_per_plot,
      max_events_per_plot: max_events_per_plot
    }).subscribe(
      json => {
        let data = normalize(json.data, schema.nilm)
        this._dispatch(data.entities);
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
  }

  public refreshNilm(id: number) {
    let o = this.http.get<schema.IApiResponse>(`nilms/${id}.json`, {
      params: new HttpParams().set('refresh', "1")
    }).pipe(share());
    this.store.dispatch(actions.refreshingNilm({id}));
    
    o.subscribe(
      json => {
        let data = normalize(json.data, schema.nilm)
        this.messageService.setNotice("Updated installation")
        this._dispatch(data.entities);
      },
      error => {
        this.store.dispatch(actions.refreshedNilm({id}));
        this.messageService.setErrorsFromAPICall(error)
      }
    );
    return o; //for other subscribers
  }

  public removeNilm(nilm: INilm) {
    let o = this.http
      .delete<schema.IApiResponse>(`nilms/${nilm.id}.json`)
      .pipe(share());

    o.subscribe(
      json => {
        this.store.dispatch(actions.removeNilm({id: nilm.id}));

        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  // -------- private helper functions --------
  private _dispatch(entities) {
    let nilms = entityFactory(entities['nilms'], defaultNilm);
    this.store.dispatch(actions.receiveNilm({nilms}));
    let apps = entityFactory(entities['dataApps'], defaultDataApp);
    this.store.dispatch(actions.receiveDataApp({apps}));
    let folders = entityFactory(entities['dbFolders'], defaultDbFolder);
    this.store.dispatch(actions.receiveDbFolder({folders}));
  }

}

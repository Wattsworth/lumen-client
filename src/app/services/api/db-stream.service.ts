import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { normalize } from 'normalizr';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { entityFactory, 
  defaultDbStream, 
  defaultDbElement } from '../../store/data/initial-state'
import { IDbStream } from '../../store/data';

import * as actions from '../../store/data/actions';


@Injectable()
export class DbStreamService {


  constructor(
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService
  ) { }


  public loadStreams(streamIDs: number[]): void {
    let urlParams = new URLSearchParams;
    urlParams.set('streams',JSON.stringify(streamIDs))

    this.http
      .get(`db_streams.json`, {
        params: new HttpParams().set('streams',JSON.stringify(streamIDs))})
      .subscribe(
      json => {
        let entities = normalize(json, schema.dbStreams).entities;
        this._dispatch(entities)
      },
        error => this.messageService.setErrorsFromAPICall(error)
      );
  }

  
  public updateStream(stream: IDbStream): void {
    this.http
      .put<schema.IApiResponse>(`db_streams/${stream.id}.json`, stream)
      .subscribe(
      json => {
        let entities = normalize(json.data, schema.dbStream).entities;
        this._dispatch(entities);
        this.messageService.setMessages(json.messages);
      },
      error => this.messageService.setErrorsFromAPICall(error));
  }

  // -------- private helper functions --------
  private _dispatch(entities: any) {
    let streams = entityFactory(entities['dbStreams'], defaultDbStream);
    this.store.dispatch(actions.receiveDbStream({streams}));
    let elements = entityFactory(entities['dbElements'], defaultDbElement);
    this.store.dispatch(actions.receiveDbElement({elements}));
  }

}

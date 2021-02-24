import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { normalize } from 'normalizr';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { entityFactory, 
  defaultDbFolder, 
  defaultDbStream, 
  defaultDbElement } from 'app/store/data/initial-state'
import { IDbFolder } from '../../store/data';
import * as actions from '../../store/data/actions';

@Injectable()
export class DbFolderService {


  constructor(
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService
  ) { }


  public loadFolder(dbFolderId: number): void {
    this.http
      .get(`db_folders/${dbFolderId}.json`, {})
      .subscribe(
      json => this._dispatch(json),
      error => this.messageService.setErrorsFromAPICall(error));
  }

  public updateFolder(dbFolder: IDbFolder): void {
    this.http
      .put<schema.IApiResponse>(`db_folders/${dbFolder.id}.json`, dbFolder)
      .subscribe(
        json => {
          this._dispatch(json.data);
          this.messageService.setMessages(json.messages);
        },
        error => this.messageService.setErrorsFromAPICall(error));  
  }

  // -------- private helper functions --------
  private _dispatch(json) {
    let entities = normalize(json, schema.dbFolder).entities;
    let folders = entityFactory(entities['dbFolders'], defaultDbFolder);
    this.store.dispatch(actions.receiveDbFolder({folders}));
    let streams = entityFactory(entities['dbStreams'], defaultDbStream);
    this.store.dispatch(actions.receiveDbStream({streams}));
    let elements = entityFactory(entities['dbElements'], defaultDbElement);
    this.store.dispatch(actions.receiveDbElement({elements}));
  }
}

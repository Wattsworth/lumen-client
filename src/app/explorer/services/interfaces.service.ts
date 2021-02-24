import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Store, createSelector } from '@ngrx/store';
import { take } from 'rxjs/operators'
import * as InterfaceActions from '../store/interfaces/actions';
import { IAppState } from '../../app.store';
import * as schema from '../../api';
import { normalize } from 'normalizr';
import { IDataApp } from '../../store/data';
import * as actions from '../../store/data/actions';
import { MessageService } from 'app/services';
import { IInterfaceState } from '../store/interfaces';
import { defaultDataApp } from 'app/store/data/initial-state';


@Injectable()
export class InterfacesService {


  constructor(
    private http: HttpClient,
    private store: Store<IAppState>,
    private messageService: MessageService
  ) {}

  //display data app in a tab
  //
  public add_internal(id: number) {
    //if the id is already displayed just select it
    //otherwise display it and request the index page
    let interfaceState: IInterfaceState;
    let selectInterfaceState = createSelector(
      (state: IAppState) => state.ui.explorer.interfaces, x=>x);
    this.store.select(selectInterfaceState).pipe(take(1)).subscribe(
      s => interfaceState = s
    );
    if (interfaceState.displayed.indexOf(id) == -1){
      this.http
      .get(`app/${id}.json`)
      .subscribe(
      json => {
        let normalized = normalize(json, schema.dataApp);
        let dataApps: IDataApp[] = normalized.result.map(id => ({...defaultDataApp, ...normalized.entities[id]}))
        this.store.dispatch(actions.receiveDataApp({apps: dataApps}));
        this.store.dispatch(InterfaceActions.addInterface({id: +id}))
      },
      error => this.messageService.setError("App not available"))
    } else {
        this.store.dispatch(InterfaceActions.addInterface({id: +id}))
    }
  }

  //open data app in new window
  //
  public add_external(id: number) {
    //if the id is already displayed just select it
    //otherwise display it and request the index page
    
    this.http
    .get(`app/${id}.json`)
    .subscribe(
    json => {
      let entities = normalize(json, schema.dataApp).entities;
      let normalized = normalize(json, schema.dataApp);
      let dataApps: IDataApp[] = normalized.result.map(id => ({...defaultDataApp, ...normalized.entities[id]}))
      this.store.dispatch(actions.receiveDataApp({apps: dataApps}));
      window.open(entities[id].url, '_blank')
    },
    error => this.messageService.setError("App not available"))
  }

  //hide a joule module interface
  //
  public remove(id: number) {
    this.store.dispatch(InterfaceActions.removeInterface({id}))
  }

  //set the displayed interface
  // (null to display data explorer)
  //
  public select(id: number) {
    if(id==null){
      this.store.dispatch(InterfaceActions.selectInterface({id: null}))
    } else {
      this.store.dispatch(InterfaceActions.selectInterface({id: +id}))
    }
  }
}

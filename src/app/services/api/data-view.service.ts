import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { tap, map, share } from 'rxjs/operators';
import { compressToEncodedURIComponent } from 'lz-string';
import { normalize } from 'normalizr';
import * as _ from 'lodash';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { IAppState } from '../../app.store';
import { DbElementService } from './db-element.service';
import { DbStreamService } from './db-stream.service'
import { ColorService } from './color.service';
import { DataViewFactory } from '../../store/data';
import {
  IDbElementRecords,
  DbElementActions,
  IDataView,
  IData,
  IDataViewRedux,
  DataViewActions
} from '../../store/data';

import * as plot from '../../explorer/store/plot'
import * as explorer from '../../explorer/store';

export const MAX_SAVE_DATA_LENGTH = 200;

@Injectable()
export class DataViewService {


  private dataViewsLoaded: boolean;
  private homeViewRestored: boolean; //only load the home view once

  constructor(
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private messageService: MessageService,
    private elementService: DbElementService,
    private streamService: DbStreamService,
    private colorService: ColorService,
  ) {
    this.dataViewsLoaded = false;
  }

  // ---- HTTP API Functions ----------

  //retrive data views from server
  //
  public loadDataViews() {
    if (this.dataViewsLoaded) {
      return empty();
    }

    let o = this.http
      .get('data_views.json', {}).pipe(
      map(json => normalize(json, schema.dataViews).entities))
      .pipe(share());

    o.subscribe(
      entities => {
        this.dataViewsLoaded = true;
        this.ngRedux.dispatch({
          type: DataViewActions.RECEIVE,
          payload: entities['data_views']
        })
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o; //for other subscribers
  }

  //remove a data view owned by the current user
  //
  public deleteDataView(view: IDataView) {
    this.http
      .delete(`data_views/${view.id}.json`)
      .subscribe(
      json => {
        this.ngRedux.dispatch({
          type: DataViewActions.REMOVE,
          payload: view.id
        })
        this.messageService.setMessages(json['messages']);
      },
      error => this.messageService.setErrorsFromAPICall(error)
      )
  }


  //create a new data view
  //
  public create(name: string, description: string, 
    isPrivate: boolean, isHome: boolean, image: string): Observable<any> {

    let state = this.getDataViewState(true);

    let visibility = isPrivate ? 'private' : 'public'
    let params = {
      name: name,
      description: description,
      image: image,
      visibility: visibility,
      stream_ids: state.stream_ids,
      home: isHome,
      redux_json: compressToEncodedURIComponent(JSON.stringify(state.redux))
    }
    let o = this.http
      .post<schema.IApiResponse>('data_views.json', params).pipe(
      tap(json => this.messageService.setMessages(json.messages)),
      map(json => normalize(json.data, schema.dataView).entities),
      share()
    )

    o.subscribe(
      entities => {
        this.ngRedux.dispatch({
          type: DataViewActions.RECEIVE,
          payload: entities['data_views']
        })
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  //update an existing data view
  //
  public update(view: IDataView): Observable<any> {
    let o = this.http
      .put<schema.IApiResponse>(`data_views/${view.id}.json`, {
        name: view.name,
        description: view.description,
        visibility: view.private ? 'private' : 'public',
        home: view.home
      }).pipe(
      tap(json => this.messageService.setMessages(json.messages)),
      map(json => normalize(json.data, schema.dataView).entities),
      share())

    o.subscribe(
      entities => {
        this.ngRedux.dispatch({
          type: DataViewActions.RECEIVE,
          payload: entities['data_views']
        })
      },
      error => this.messageService.setErrorsFromAPICall(error)
    );
    return o;
  }

  //load and restore a user's home view
  //
  public restoreHomeDataView() {
    if (this.homeViewRestored)
      return;
    this.homeViewRestored = true;
    this.http
      .get('data_views/home.json', {}).pipe(
       map(json => normalize(json, schema.dataView)),
       map(json => json.entities.data_views[json.result]),
       map(json => DataViewFactory(json)))
      .subscribe(
      view => this.restoreDataView(view),
      error => console.log("unable to load home data view")
      );
  }

  //------------------ Local Functions -----------------------
  // Restore:
  // Set redux state from data view
  //
  public restoreDataView(view: IDataView) {
    //first clear the plot
    this.elementService.resetElements();
    this.ngRedux.dispatch({
      type: explorer.PlotActions.HIDE_ALL_ELEMENTS,
    })
    //now set the plot & nav time ranges so we don't reload the data 
    //(they are null after HIDE_ALL_ELEMENTS)
    this.ngRedux.dispatch({
      type: explorer.PlotActions.SET_PLOT_TIME_RANGE,
      payload: view.redux.ui_explorer.plot_time
    })
    this.ngRedux.dispatch({
      type: explorer.PlotActions.SET_NAV_TIME_RANGE,
      payload: view.redux.ui_explorer.nav_time
    })
    //now load the data elements
    this.elementService.restoreElements(view.redux.data_dbElements)

    //register colors with color service
    let newElements = view.redux.data_dbElements;
    Object.keys(newElements)
      .map(id => newElements[id])
      .map(element => {
        this.colorService.checkoutColor(element.color);
      })
    //restore the plot
    this.ngRedux.dispatch({
      type: explorer.PlotActions.RESTORE_VIEW,
      payload: view.redux.ui_explorer
    });
    //load the associated streams if they haven't been retrieved already
    this.ngRedux.getState().data.dbStreams
    let viewStreamIds = _.uniq(_.keys(newElements)
      .map(id => newElements[id])
      .map(elem => elem.db_stream_id))
    let existingStreamIds = _.keys(this.ngRedux.getState().data.dbStreams)
      .map(id => parseInt(id))
    let newStreamIds = _.difference(viewStreamIds, existingStreamIds)
    if (newStreamIds.length > 0)
      this.streamService.loadStreams(newStreamIds)

  }

  // GetDataViewState:
  // Compute redux state for the data view
  //
  public getDataViewState(includeData: boolean): IDataViewState {
    let allElements = this.ngRedux.getState().data.dbElements;
    let explorerState = this.ngRedux.getState().ui.explorer.plot;
    let plottedElements = _.concat(
      explorerState.left_elements,
      explorerState.right_elements)
      .reduce((acc, id) => {
        acc[id] = allElements[id];
        return acc
      }, {})

    //compute array of unique stream ids so we can organize
    //data views by permission on the server
    let stream_ids = _.uniq(Object.keys(plottedElements)
      .map(id => plottedElements[id].db_stream_id))
    //sanitize explorer ui state
    let plot_ui = <plot.IState>(<any>this.ngRedux.getState().ui.explorer.plot).toJS();
    plot_ui.show_date_selector = false; //hide in case it is visible
    if (includeData) {
      //remove nav_data and data that are not part of plottedElements
      plot_ui.plot_data = Object.keys(plottedElements)
        .reduce((acc, id) => {
          let dataset = plot_ui.plot_data[id];
          if (dataset === undefined) {
            return acc; //data is missing we can't save it
          }
          acc[id] = this.decimateDataset(dataset);
          return acc;
        }, {})
      plot_ui.nav_data = Object.keys(plottedElements)
        .reduce((acc, id) => {
          let dataset = plot_ui.nav_data[id];
          if (dataset === undefined) {
            return acc; //data is missing we can't save it
          }
          acc[id] = this.decimateDataset(dataset);
          return acc;
        }, {})
    } else {
      plot_ui.plot_data = {};
      plot_ui.nav_data = {};
    }
    return {
      redux: {
        ui_explorer: plot_ui,
        data_dbElements: plottedElements
      },
      stream_ids: stream_ids
    }
  }

  public decimateDataset(dataset: IData) {
    let smallDataset: IData = { //manually copy so this is not an immutable record
      data: dataset.data,
      end_time: dataset.end_time,
      start_time: dataset.start_time,
      valid: dataset.valid,
      type: dataset.type
    }
    let data = dataset.data
    if (data !== undefined && data.length > MAX_SAVE_DATA_LENGTH) {
      //we need to decimate the data, there is too much
      smallDataset.data = [];
      //remove time stamps so the client will automatically reload this
      //data at the full resolution
      smallDataset.end_time = 0;
      smallDataset.start_time = 0;
      let step = Math.ceil(data.length / MAX_SAVE_DATA_LENGTH)
      for (let i = 0; i < data.length; i = i + step) {
        smallDataset.data.push(data[i])
      }
      //console.log('orig, decimated:', data.length, smallDataset.data.length)
    } else {
      //console.log('no decimation required: ',data.length, smallDataset.data.length);
    }
    return smallDataset

  }
}

export interface IDataViewState {
  redux: IDataViewRedux
  stream_ids: Array<number>
}


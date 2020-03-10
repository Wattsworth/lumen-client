import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import { timeout, map, share } from 'rxjs/operators';
import { normalize } from 'normalizr';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { DataViewService } from './data-view.service';
import { IAppState } from '../../app.store';
import {
  IDbElement,
  IDbStream
} from '../../store/data';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private messageService: MessageService,
    private dataViewService: DataViewService
  ) { }

  public loadData(
    startTime: number, //values in milliseconds!
    endTime: number,
    elements: IDbElement[],
    resolution: number,
    padding: number = 0
  ): Observable<any> {
    
    let params = new HttpParams()
      .set('elements', JSON.stringify(elements.map(e => e.id)))
       .set('resolution', String(resolution))
      .set('padding', String(padding))
    if(startTime!=null)
      params = params.set('start_time',(startTime * 1e3).toString())
    if(endTime!=null)
      params = params.set('end_time',(endTime * 1e3).toString())
     
    let o = this.http.get<schema.IApiResponse>('db_elements/data.json', 
      {params: params}).pipe(
      timeout(20000), //wait a maximum of 20 seconds
      map(json => normalize(json.data, schema.datas)),
      map(normalized => normalized.entities.data),
      share())
    o.subscribe(_ => {}, 
    error => {
      this.messageService.setErrorsFromAPICall(error)
    });
    return o;
  }

  public downloadStream(
    startTime: number, //values in milliseconds!
    endTime: number,
    resolution: number,
    stream: IDbStream): Observable<any> {
      console.log('at resolution: ', resolution)
    return this.http
      .post(`db_streams/${stream.id}/data.csv`,
      {
        start_time: (startTime * 1e3).toString(),
        end_time: (endTime * 1e3).toString(),
        resolution: resolution
      }, {responseType: "blob"}).pipe(
      //map(data => new Blob([data['_body']], { type: 'text/csv' })),
      map(blob => window.URL.createObjectURL(blob)));

  }

}


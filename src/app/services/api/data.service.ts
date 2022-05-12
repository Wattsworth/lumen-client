import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import { timeout, map, share, tap } from 'rxjs/operators';
import { normalize } from 'normalizr';
import * as schema from '../../api';
import { MessageService } from '../message.service';
import { IAppState } from '../../app.store';
import {
  IDbElement,
  IDbStream,
  IEventStream
} from '../../store/data';
import { defaultData, defaultEvent } from 'app/store/data/initial-state';
import { GroupsComponent } from 'app/account/components/groups/groups.component';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
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
      map(json => {
        let raw_data = json.entities['data']
        return Object.keys(raw_data).reduce((acc,id)=>{
          acc[id]=Object.assign({},defaultData,raw_data[id]); 
          return acc}, {})}),
      share())
    o.subscribe(_ => {}, 
    error => {
      this.messageService.setErrorsFromAPICall(error)
    });
    return o;
  }

  public loadEvents(
    startTime: number, //values in milliseconds!
    endTime: number,
    streams: IEventStream[],
    padding: number = 0
  ): Observable<any> {
    let params = new HttpParams()
      .set('streams', JSON.stringify(streams.map(s => {
        let filter_string = s.filter_groups.reduce((groups, group)=>{
            groups.push(
            group.reduce((clauses, clause)=>{
                clauses.push([clause.key, clause.comparison, clause.value])
                return clauses}, []));
              return groups
            }, <any[]>[])
        return {id: s.id, filter: filter_string}})))
      .set('padding', String(padding))
    if(startTime!=null)
      params = params.set('start_time',(startTime * 1e3).toString())
    if(endTime!=null)
      params = params.set('end_time',(endTime * 1e3).toString())
     
    let o = this.http.get<schema.IApiResponse>('events/data.json', 
      {params: params}).pipe(
      timeout(20000), //wait a maximum of 20 seconds
      map(json => normalize(json.data, schema.events)),

      map(json =>  json.entities['event']),
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


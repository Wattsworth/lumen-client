import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import{ ColorService } from './color.service';

import {
  IEventStream,
} from '../../store/data';
import * as actions from '../../store/data/actions';

@Injectable()
export class EventStreamService {

  constructor(
    private store: Store,
    private colorService: ColorService
  ) { }

  public setDisplayName(stream: IEventStream, name: string){
    this.store.dispatch(actions.setEventStreamName({name, id: stream.id}));
  }
  public setPlotSettings(stream_id: number, offset: number, height: number, selected: boolean){
    this.store.dispatch(actions.setEventStreamPlotSettings({id: stream_id, offset, height, selected}))
  }
  public setColor(stream: IEventStream, color: string){
    if(stream.color == color)
      return; //nothing to do
    if(stream.color!=null){
      this.colorService.returnEventColor(stream.color);
    }
    this.store.dispatch(actions.setEventStreamColor({color, id: stream.id})); 
  }
  
  public assignColor(stream: IEventStream){
    if(stream.color!=null)
      return; //already has a color so nothing to do
    this.store.dispatch(actions.setEventStreamColor({
      color: this.colorService.requestEventColor(), id: stream.id})); 
  }

  public removeColor(stream: IEventStream){
    if(stream.color==null)
      return; //no color associated with this element
    this.colorService.returnEventColor(stream.color);
    this.store.dispatch(actions.setEventStreamColor({color: null, id: stream.id})); 
  }

  public restoreEventStreams(streams: IEventStream[]){
    this.store.dispatch(actions.restoreEventStream({streams})); 
  }
  public resetEventStreams(){
    this.store.dispatch(actions.resetEventStream()); 
  }
}


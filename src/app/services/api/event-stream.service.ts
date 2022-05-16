import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import{ ColorService } from './color.service';

import {
  IEventStream, IEventStreamFilterGroup, IEventStreamPlotSettings,
} from '../../store/data';
import * as actions from '../../store/data/actions';
import * as _ from 'lodash-es';
import { identity } from 'lodash';
@Injectable()
export class EventStreamService {

  constructor(
    private store: Store,
    private colorService: ColorService
  ) { }

  public setPlotSettings(stream_id: string, settings: IEventStreamPlotSettings){
    this.store.dispatch(actions.setEventStreamPlotSettings({id: stream_id, settings}))
  }
  public setFilterGroups(stream_id: string, filter_groups: Array<IEventStreamFilterGroup>){
    this.store.dispatch(actions.setEventStreamFilterGroups({id: stream_id, filter_groups}))
  }
  public setColor(stream: IEventStream, color: string){
    if(stream.default_color == color)
      return; //nothing to do
    if(stream.default_color!=null){
      this.colorService.returnEventColor(stream.default_color);
    }
    this.store.dispatch(actions.setEventStreamColor({color, id: stream.id})); 
  }
  
  public assignColor(stream: IEventStream){
    let color = stream.default_color;
    if(color==null){
      color = this.colorService.requestEventColor()
      this.store.dispatch(actions.setEventStreamColor({color, id: stream.id})); 
    }
    //make sure the fixed color is not null
    if(stream.plot_settings.color.value.fixed==null){
      let settings: IEventStreamPlotSettings = _.cloneDeep(stream.plot_settings)
      settings.color.value.fixed = color;
      this.store.dispatch(actions.setEventStreamPlotSettings({id: stream.id, settings}))
    }
  }

  public removeColor(stream: IEventStream){
    if(stream.default_color==null)
      return; //no color associated with this element
    this.colorService.returnEventColor(stream.default_color);
    this.store.dispatch(actions.setEventStreamColor({color: null, id: stream.id})); 
  }

  public restoreEventStreams(streams: IEventStream[]){
    this.store.dispatch(actions.restoreEventStream({streams})); 
  }
  public resetEventStreams(){
    this.store.dispatch(actions.resetEventStream()); 
  }
  public duplicateEventStream(stream: IEventStream){
    this.store.dispatch(actions.duplicateEventStream({id: stream.id}))
  }
  public deduplicateEventStream(stream: IEventStream){
    this.store.dispatch(actions.deduplicateEventStream({id: stream.id}));
  }
  public removeDuplicateEventStreams(stream: IEventStream){
    this.store.dispatch(actions.removeDuplicateEventStreams({id: stream.id}));
  }
}


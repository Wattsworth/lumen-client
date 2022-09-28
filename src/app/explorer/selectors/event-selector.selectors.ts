import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import { IAppState } from '../../app.store';
import { Observable } from 'rxjs';



export const EVENT_SELECTOR_REDUX= ['ui','explorer','eventSelector'];

@Injectable()
export class EventSelectorSelectors {
 
    eventSelectorUI_ = (state:IAppState)=>state.ui.explorer.eventSelector;

    enabled$ = this.store.select(createSelector(this.eventSelectorUI_,state=>state.enabled));
    selectedEventsSet$ = this.store.select(createSelector(this.eventSelectorUI_,state=>state.eventsSet))
    constructor(
        private store: Store
    ){}
    

}
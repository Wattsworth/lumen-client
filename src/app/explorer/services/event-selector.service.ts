import { Injectable } from '@angular/core';
import { IAppState } from '../../app.store';
import { Store } from '@ngrx/store';

import * as EventSelectorActions from '../store/event-selector/actions';
import * as MeasurementActions from '../store/measurement/actions';
import * as AnnotationActions from '../store/annotations/actions'
@Injectable()
export class EventSelectorService {

    constructor(
        private store: Store<IAppState>,
    ){}
  //start event selection mode
  //
  public startEventSelector() {
    this.store.dispatch(EventSelectorActions.enableEventSelector());
    //make sure the Annotation and Measurement Modes are disabled
    this.store.dispatch(MeasurementActions.disableMeasurements());
    this.store.dispatch(AnnotationActions.disableAnnotations());
  }

  //exit event selection mode
  //
  public exitEventSelector() {
    this.store.dispatch(EventSelectorActions.disableEventSelector());

  }
}


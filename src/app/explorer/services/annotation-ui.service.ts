import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRange } from '../store';
import * as MeasurementActions from '../store/measurement/actions';
import * as AnnotationActions from '../store/annotations/actions';
import * as EventSelectorActions from '../store/event-selector/actions';
import { HttpClient } from '@angular/common/http';
import {IAnnotation} from '../../store/data'

@Injectable()
export class AnnotationUIService {


  constructor(
    private store: Store,
    private http: HttpClient
  ) {
  }

  //start measurement mode
  //
  public startAnnotation() {
    this.store.dispatch(AnnotationActions.enableAnnotations())
    //make sure the Event Selector and Measurement Modes are disabled
    this.store.dispatch(MeasurementActions.disableMeasurements());
    this.store.dispatch(EventSelectorActions.disableEventSelector());

  }

  //exit measurement mode
  //
  public cancelAnnotation() {
    this.store.dispatch(AnnotationActions.disableAnnotations())
  }

  //set the range or point to annotate
  //
  public setRange(range: IRange) {
    this.store.dispatch(AnnotationActions.setAnnotationRange({range}))
  }
  //set the range or point to annotate
  //
  public clearRange() {
    this.store.dispatch(AnnotationActions.clearAnnotationRange())
  }

  //select an annotation to display
  //
  public selectAnnotation(annotation: IAnnotation){
    this.store.dispatch(MeasurementActions.clearMeasurementZero())
    this.store.dispatch(AnnotationActions.showAnnotation({id: annotation.id}))
  }

  //hide annotation
  public hideAnnotation(){
    this.store.dispatch(AnnotationActions.hideAnnotation())
  }
}
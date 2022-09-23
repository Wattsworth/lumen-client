import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRange } from '../store';
import * as MeasurementActions from '../store/measurement/actions';
import * as AnnotationActions from '../store/annotations/actions';
import {
  MeasurementSelectors,
  PlotSelectors
} from '../selectors';
import { IMeasurementSet } from '../store/measurement';
import { PlotService } from './plot.service';
import { IAppState } from '../../app.store';

@Injectable()
export class MeasurementService {


  constructor(
    private store: Store<IAppState>,
    private plotService: PlotService,
    private measurementSelectors: MeasurementSelectors,
    private plotSelectors: PlotSelectors
  ) {
  }

  //start measurement mode
  //
  public startMeasurement() {
    this.store.dispatch(MeasurementActions.enableMeasurements());
  }

  //exit measurement mode
  //
  public cancelMeasurement() {
    this.store.dispatch(MeasurementActions.disableMeasurements());

  }

  //makeMeasurement
  //  make a measurement over the specified range
  //
  public setRange(range: IRange) {
    this.store.dispatch(MeasurementActions.setMeasurementRange({range}));
  }

  //eraseMeasurement
  //
  public clearRange(){
    this.store.dispatch(MeasurementActions.clearMeasurementRange())
  }

  //set zero to current measurement range
  //
  public setZero() {
    //hide annotation if displayed
    this.store.dispatch(AnnotationActions.hideAnnotation());
    this.store.dispatch(MeasurementActions.setMeasurementZero());
  }

  //remove the zero
  public clearZero(){
    this.store.dispatch(MeasurementActions.clearMeasurementZero());
  }

  //set whether the measurement is relative
  //
  public setRelative(relative: boolean) {
    this.store.dispatch(MeasurementActions.setRelativeMeasurementMode({relative}))
  }

  //set the direct measurements
  //
  public setDirectMeasurements(measurements: IMeasurementSet) {
    this.store.dispatch(MeasurementActions.setDirectMeasurements({measurements}))
  }

  //set the relative measurements
  //
  public setRelativeMeasurements(measurements: IMeasurementSet) {
    this.store.dispatch(MeasurementActions.setRelativeMeasurements({measurements}))
  }

  //add new zero measurements 
  //
  public addZeroMeasurements(measurements: IMeasurementSet){
    this.store.dispatch(MeasurementActions.addZeroMeasurements({measurements}))
  }
}

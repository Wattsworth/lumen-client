import { Injectable } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { measurement_UI_Ex_ } from 'app/selectors';

import {
  IRange,
} from '../store';
import {IMeasurementSet} from '../store/measurement';

export const MEASUREMENT_REDUX= ['ui','explorer','measurement'];

@Injectable()
export class MeasurementSelectors {
 
  enabled$ = this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.enabled)));
  measurementRange$= this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.measurement_range)));
  zeroRange$= this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.zero_range)));
  directMeasurements$= this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.direct_measurements)));
  relativeMeasurements$= this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.relative_measurements)));
  relative$ = this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.relative)));
  zeroMeasurements$= this.store.pipe(select(createSelector(measurement_UI_Ex_, state=>state.zero_measurements)));
  public zeroSet$: Observable<boolean>
  public measurementRangeString$: Observable<string>

  constructor(
    private store: Store
  ){

    this.zeroSet$ = this.zeroRange$
      .pipe(map(range => {
        if(range==null)
          return false;
        return true;
      }));
    this.measurementRangeString$ = this.measurementRange$
      .pipe(map(range=> {
        if(range==null)
          return "not set";
        return `${range.min}, ${range.max}`
      }))

  }
}

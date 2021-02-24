import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IState } from './types';
import {
  defaultMeasurementState
} from './initial-state';

export const reducer = createReducer(
  defaultMeasurementState,
  //enter measurement mode
  on(actions.enableMeasurements, (state: IState)=>({...state, enabled: true})),
  //cancel measurement mode
  on(actions.disableMeasurements, (state: IState)=>({...state, enabled: false})),
  //set the measurement range
  on(actions.setMeasurementRange, (state: IState, {range})=>({...state, measurement_range: range})),
  //clear the measurement range
  on(actions.clearMeasurementRange, (state: IState)=>({...state, measurement_range: null})),
  //set the measurement zero
  on(actions.setMeasurementZero, (state: IState)=>({...state, zero_range: state.measurement_range, zero_measurements: state.direct_measurements})),
  //clear the zero
  on(actions.clearMeasurementZero, (state: IState)=>({...state, zero_measurements: {}, relative: false, zero_range: null})),
  //set the measurements
  on(actions.setDirectMeasurements, (state: IState, {measurements})=>({...state, direct_measurements: measurements})),
  //set the relative measurements
  on(actions.setRelativeMeasurements, (state: IState, {measurements})=>({...state, relative_measurements: measurements})),
  //update the zero measurements
  on(actions.addZeroMeasurements, (state: IState, {measurements})=>({...state, 
    zero_measurements:{...state.zero_measurements, ...measurements}})),
  //set whether measurements are relative to the zero
  on(actions.setRelativeMeasurementMode, (state: IState, {relative})=>({...state, relative}))
);

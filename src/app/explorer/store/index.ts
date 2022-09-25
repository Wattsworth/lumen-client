
import { combineReducers} from '@ngrx/store';

import * as plot from './plot';
import * as measurement from './measurement';
import * as interfaces from './interfaces';
import * as annotations from './annotations';
import * as eventSelector from './event-selector';

export {IRange, IAxisSettings} from './helpers';
//   TOP LEVEL: Measurement, Plot
export interface IState {
  plot?: plot.IState,
  measurement?: measurement.IState,
  interfaces?: interfaces.IInterfaceState,
  annotation?: annotations.IAnnotationState,
  eventSelector?: eventSelector.IState
}
export const reducer = combineReducers<IState>({
  plot: plot.reducer,
  measurement: measurement.reducer,
  interfaces: interfaces.reducer,
  annotation: annotations.reducer,
  eventSelector: eventSelector.reducer
})
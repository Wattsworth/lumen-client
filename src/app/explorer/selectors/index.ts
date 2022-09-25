import {AnnotationSelectors} from './annotation.selectors';
import {MeasurementSelectors} from './measurement.selectors';
import {PlotSelectors} from './plot.selectors';
import {InterfacesSelectors} from './interfaces.selectors';
import { EventSelectorSelectors } from './event-selector.selectors';
// export here for object imports
export {
  AnnotationSelectors,
  PlotSelectors,
  MeasurementSelectors, 
  InterfacesSelectors,
  EventSelectorSelectors
};
export const SELECTORS = [
  AnnotationSelectors,
  MeasurementSelectors, 
  PlotSelectors,
  InterfacesSelectors,
  EventSelectorSelectors
];


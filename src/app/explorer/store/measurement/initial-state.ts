
import {
  IState,
} from './types';


// ---- Plot ----
export const defaultMeasurementState:IState = {
  enabled: false,
  measurement_range: null,
  zero_range: null,
  direct_measurements: {},
  relative_measurements: {},
  relative: false,
  zero_measurements: {}
};

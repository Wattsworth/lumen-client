import { IRange } from '../helpers';
export interface IState {
  enabled: boolean;
  measurement_range: IRange;
  zero_range: IRange;
  direct_measurements: IMeasurementSet;
  relative_measurements: IMeasurementSet;
  relative: boolean;
  zero_measurements: IMeasurementSet;
}

export interface IMeasurement {
  min?: number;
  max?: number;
  mean?: number;
  valid: boolean;
}

export interface IMeasurementSet {
  [index: string]: IMeasurement; //indexed by DbElement ID
}

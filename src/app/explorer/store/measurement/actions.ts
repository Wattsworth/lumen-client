import {createAction, props} from '@ngrx/store'
import {IRange} from '../helpers'
import {IMeasurementSet} from './types'

export const enableMeasurements = createAction('[EXPLORER: MEASUREMENT] Enable measurements')
export const disableMeasurements = createAction('[EXPLORER: MEASUREMENT] Disable measurements')
export const setMeasurementRange = createAction('[EXPLORER: MEASUREMENT] Set range', props<{range: IRange}>())
export const clearMeasurementRange = createAction('[EXPLORER: MEASUREMENT] Clear range')
export const setMeasurementZero = createAction('[EXPLORER: MEASUREMENT] Set zero')
export const clearMeasurementZero = createAction('[EXPLORER: MEASUREMENT] Clear zero')
export const setDirectMeasurements = createAction('[EXPLORER: MEASUREMENT] Set direct measurements', props<{measurements: IMeasurementSet}>())
export const setRelativeMeasurements = createAction('[EXPLORER: MEASUREMENT] Set relative measurements', props<{measurements: IMeasurementSet}>())
export const addZeroMeasurements = createAction('[EXPLORER: MEASUREMENT] Add zero measurements', props<{measurements: IMeasurementSet}>())
export const setRelativeMeasurementMode = createAction('[EXPLORER: MEASUREMENT] Set relative mode', props<{relative: boolean}>())

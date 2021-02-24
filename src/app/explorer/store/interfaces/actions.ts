import {createAction, props} from '@ngrx/store'
import {IRange} from '../helpers'

export const addInterface = createAction('[EXPLORER: INTERFACE] Add Interface', props<{id: number}>());
export const removeInterface = createAction('[EXPLORER: INTERFACE] Remove Interface', props<{id: number}>());
export const selectInterface = createAction('[EXPLORER: INTERFACE] Select Interface', props<{id: number}>());

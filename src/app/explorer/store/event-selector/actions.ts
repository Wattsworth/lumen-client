import {createAction, props} from '@ngrx/store'
import { IEventsSet } from 'src/app/store/data'

export const enableEventSelector = createAction('[EXPLORER: EVENT SELECTOR] Enable event selection')
export const disableEventSelector = createAction('[EXPLORER: EVENT SELECTOR] Disable event selection')
export const addEvents = createAction('[EXPLORER: EVENT SELECTOR] Add events to selection', props<{eventsSet: IEventsSet}>())
export const removeEvents = createAction('[EXPLORER: EVENT SELECTOR] Remove events from selection', props<{eventsSet: IEventsSet}>())
export const clearSelection = createAction('[EXPLORER: EVENT SELECTOR] Clear selection')

import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IState } from './types';
import { IRange } from '../helpers'
import {
  defaultEventSelectorState
} from './initial-state';

export const reducer = createReducer(
    defaultEventSelectorState,
    //enter event selector state
    on(actions.enableEventSelector, (state: IState) => ({...state, enabled: true})),
    //cancel event selector state
    on(actions.disableEventSelector, (state: IState) => ({...state, enabled: false})),
);
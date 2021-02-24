import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IState } from './types';
import {
  defaultAccountState
} from './initial-state';

export const reducer = createReducer(
  defaultAccountState,
  //set flag to indicate data views are loaded
  on(actions.setDataViewsLoaded, (state: IState)=>({...state, data_views_loaded: true})),
  //set flag to indicate nilms are loaded
  on(actions.setNilmsLoaded, (state: IState,)=>({...state, nilms_loaded: true})),
  //set flag to indicate user groups are loaded
  on(actions.setUserGroupsLoaded, (state: IState,)=>({...state, user_groups_loaded: true})),
  //set flag to indicate server is processing login
  on(actions.setLoggingIn, (state: IState, {logging_in})=>({...state, logging_in})),
);

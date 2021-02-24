import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IInterfaceState } from './types';
import {
  defaultInterfaceState
} from './initial-state';

export const reducer = createReducer(
  defaultInterfaceState,
  on(actions.addInterface, (state: IInterfaceState, {id})=>{
    if (state.displayed.indexOf(id)>-1){
      //just select the id if it is already in the state
      return {...state, selected: id};
    } else {
      //otherwise add it and select it
      return ({...state, selected: id, displayed: [...state.displayed, id]});
    }
  }),
  on(actions.removeInterface, (state: IInterfaceState, {id})=>{
    if(id==state.selected){
      //if removed interface is selected switch to explorer
      return  {...state, selected: null, displayed: state.displayed.filter(fid=>fid!=id)}
    } else {
      //otherwise just remove the interface
      return  {...state, displayed: state.displayed.filter(fid=>fid!=id)}
    }
  }),
  on(actions.selectInterface, (state: IInterfaceState, {id})=>({...state, selected: id})),
  )

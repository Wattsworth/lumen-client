import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IInstallation } from './types';
import {
  defaultInstallation
} from './initial-state';


export const reducer = createReducer(
  defaultInstallation,
  on(actions.selectDbFolder, (state: IInstallation, {id})=>({...state, selectedDbFolder: id, selectedType: 'dbFolder'})),
  on(actions.selectDbStream, (state: IInstallation, {id})=>({...state, selectedDbStream: id, selectedType: 'dbStream'})),
  on(actions.selectDataApp, (state: IInstallation, {id})=>({...state, selectedDataApp: id, selectedType: 'dataApp'})),
  on(actions.setNilm, (state: IInstallation, {id})=>({...state, nilm: id})),
  on(actions.refreshing, (state: IInstallation)=>({...state, refreshing: true})),
  on(actions.refreshed, (state: IInstallation)=>({...state, refreshing: false})),
);
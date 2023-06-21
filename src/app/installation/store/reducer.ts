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
  on(actions.selectEventStream, (state: IInstallation, {id})=>({...state, selectedEventStream: id, selectedType: 'eventStream'})),
  on(actions.selectDataApp, (state: IInstallation, {id})=>({...state, selectedDataApp: id, selectedType: 'dataApp'})),
  on(actions.setNilm, (state: IInstallation, {id})=>({...state, nilm: id})),
  on(actions.refreshing, (state: IInstallation)=>({...state, refreshing: true})),
  on(actions.refreshed, (state: IInstallation)=>({...state, refreshing: false})),
  on(actions.expandNode,(state:IInstallation, {id})=>({...state, expanded_nodes: state.expanded_nodes.concat([id])})),
  on(actions.collapseNode,(state:IInstallation, {id})=>({...state, expanded_nodes: state.expanded_nodes.filter(x=>x!=id)}))
);
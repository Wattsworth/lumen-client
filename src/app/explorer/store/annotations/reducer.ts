import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IAnnotationState } from './types';
import {
  defaultAnnotationState
} from './initial-state';

export const reducer = createReducer(
  defaultAnnotationState,
  on(actions.enableAnnotations, (state: IAnnotationState)=>({...state, enabled: true})),
  on(actions.disableAnnotations, (state: IAnnotationState,)=>({...state, enabled: false})),
  on(actions.setAnnotationRange, (state: IAnnotationState, {range})=>({...state, selection_range: range})),
  on(actions.clearAnnotationRange, (state: IAnnotationState)=>({...state, selection_range: null})),
  on(actions.showAnnotation, (state: IAnnotationState, {id})=>({...state, selected_annotation: id})),
  on(actions.hideAnnotation, (state: IAnnotationState)=>({...state, selected_annotation: null}))
)

import {createAction, props} from '@ngrx/store'
import {IRange} from '../helpers'

export const enableAnnotations = createAction('[EXPLORER: ANNOTATION] Enable Annotations')
export const disableAnnotations = createAction('[EXPLORER: ANNOTATION] Disable Annotations')
export const setAnnotationRange = createAction('[EXPLORER: ANNOTATION] Set Range', props<{range: IRange}>())
export const clearAnnotationRange = createAction('[EXPLORER: ANNOTATION] Clear Range')
export const showAnnotation = createAction('[EXPLORER: ANNOTATION] Show Annotation', props<{id: string}>())
export const hideAnnotation = createAction('[EXPLORER: ANNOTATION] Hide Annotation')

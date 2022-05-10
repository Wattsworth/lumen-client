import {createAction, props} from '@ngrx/store'

export const selectDbRoot = createAction('[INSTALLATION] Select db root'); //??
export const selectDbFolder = createAction('[INSTALLATION] Select db folder', props<{id: number}>());
export const selectDataApp = createAction('[INSTALLATION] Select data app', props<{id: number}>());
export const setDbFolderMessages = createAction('[INSTALLATION] Set db folder messages'); //??
export const clearDbFolderMessages = createAction('[INSTALLATION] clear db folder messages'); //??
export const selectDbStream = createAction('[INSTALLATION] Select db stream', props<{id: number}>());
export const selectEventStream = createAction('[INSTALLATION] Select event stream', props<{id: number}>());
export const setNilm = createAction('[INSTALLATION] Set nilm', props<{id: number}>());
export const refreshing = createAction('[INSTALLATION] Refreshing');
export const refreshed = createAction('[INSTALLATION] Refreshed');

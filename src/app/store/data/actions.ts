import {createAction, props} from '@ngrx/store'
import * as types from './types';

export const receiveNilm = createAction('[NILM] Receive', props<{nilms: types.INilm[]}>());
export const refreshingNilm = createAction('[NILM] Refreshing', props<{id: number}>());
export const refreshedNilm = createAction('[NILM] Refreshed', props<{id: number}>());
export const removeNilm = createAction('[NILM] Remove', props<{id: number}>());

export const receiveDataApp = createAction('[DATA_APP] Receive', props<{apps: types.IDataApp[]}>());

export const receiveDbFolder = createAction('[FOLDER] Receive', props<{folders: types.IDbFolder[]}>());

export const receiveDbStream = createAction('[STREAM] Receive', props<{streams: types.IDbStream[]}>());
export const reloadStreamAnnotations = createAction('[STREAM] Reload Annotations', props<{id: number}>());
export const refreshedAnnotations = createAction('[STREAM] Refreshed Annotations', props<{id: number}>());

export const receiveEventStream= createAction('[EVENTS] Receive', props<{streams: types.IEventStream[]}>());
export const setEventStreamColor = createAction('[EVENTS] Set Color', props<{id: number, color: string}>());
export const setEventStreamPlotSettings = createAction('[EVENTS] Set Plot Settings', props<{id: number, settings: types.IEventStreamPlotSettings}>());

export const setEventStreamName = createAction('[EVENTS] Set Display Name', props<{id: number, name: string}>());
export const setEventStreamFilterGroups = createAction('[EVENTS] Set Filter Groups', props<{id: number, filter_groups: Array<types.IEventStreamFilterGroup>}>())
export const restoreEventStream = createAction('[EVENTS] Restore', props<{streams: types.IEventStream[]}>());
export const resetEventStream = createAction('[EVENTS] Reset');

export const receiveDbElement = createAction('[ELEMENT] Receive', props<{elements: types.IDbElement[]}>());
export const setDbElementColor = createAction('[ELEMENT] Set Color', props<{id: number, color: string}>());
export const setDbElementName = createAction('[ELEMENT] Set Display Name', props<{id: number, name: string}>());
export const restoreDbElement = createAction('[ELEMENT] Restore', props<{elements: types.IDbElement[]}>());
export const resetDbElement = createAction('[ELEMENT] Reset');

export const receiveAnnotation = createAction('[ANNOTATION] Receive', props<{annotations: types.IAnnotation[]}>());
export const removeAnnotation = createAction('[ANNOTATION] Remove', props<{id: string}>());

export const setCurrentUser = createAction('[USER] Set Current', props<{user: types.IUser}>());
export const receiveUser = createAction('[USER] Receive', props<{users: types.IUser[]}>());
export const receiveUserInstallationToken = createAction('[USER] Receive Installation Token', props<{token: string}>());
export const installationTokensUnavailable = createAction('[USER] Installation Tokens Unavailable');

export const receiveOwnerGroups = createAction('[USER GROUP] Receive Owner', props<{groups: types.IUserGroup[]}>())
export const receiveMemberGroups = createAction('[USER GROUP] Receive Member', props<{groups: types.IUserGroup[]}>())
export const receiveGroups = createAction('[USER GROUP] Receive Other', props<{groups: types.IUserGroup[]}>())
export const removeUserGroup = createAction('[USER GROUP] Remove', props<{id: number}>())

export const receivePermission = createAction('[PERMISSION] Receive', props<{permissions: types.IPermission[]}>())
export const removePermission = createAction('[PERMISSION] Remove', props<{id: number}>())

export const receiveDataView = createAction('[DATA VIEW] Receive', props<{views: types.IDataView[]}>())
export const removeDataView = createAction('[DATA VIEW] Remove', props<{id: number}>())


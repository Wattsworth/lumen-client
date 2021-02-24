import {createAction, props} from '@ngrx/store'

export const setNilmsLoaded = createAction('[ACCOUNT] Set nilms loaded');
export const setDataViewsLoaded = createAction('[ACCOUNT] Set data views loaded');
export const setUserGroupsLoaded = createAction('[ACCOUNT] Set user groups loaded');
export const setLoggingIn = createAction('[ACCOUNT] Set set logging in', props<{logging_in: boolean}>());

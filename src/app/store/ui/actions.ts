import {createAction, props} from '@ngrx/store'

export const setWarningMessages = createAction('[UI] Set Warning Messages', props<{messages: string[]}>());
export const setErrorMessages = createAction('[UI] Set Error Messages', props<{messages: string[]}>());
export const setNoticeMessages = createAction('[UI] Set Notice Messages', props<{messages: string[]}>());

export const clearMessages = createAction('[UI] Clear Messages');
export const setPageHeader = createAction('[UI] Set Page Header', props<{header: string}>());
export const enableEmails = createAction('[UI] Enable Emails', props<{enable: boolean}>());

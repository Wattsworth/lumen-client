import { createReducer, on } from '@ngrx/store';

import * as actions from './actions';
import { IUI } from './types';
import {
  defaultUI
} from './initial-state';

export const reducer = createReducer(
  defaultUI,
  on(actions.setErrorMessages, (state: IUI, {messages})=>({...state, errors: messages})),
  on(actions.setWarningMessages, (state: IUI, {messages})=>({...state, warnings: messages})),
  on(actions.setNoticeMessages, (state: IUI, {messages})=>({...state, notices: messages})),

  on(actions.clearMessages, (state: IUI)=>({...state, 
    errors: [] as string[],
    warnings: [] as string[], 
    notices: [] as string[]})),
  on(actions.enableEmails, (state: IUI, {enable})=>({...state, email_enabled: enable})),
  on(actions.setPageHeader, (state: IUI, {header})=>({...state, page_header: header})),
)

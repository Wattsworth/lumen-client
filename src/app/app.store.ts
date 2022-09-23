import { combineReducers} from '@ngrx/store';

import * as ui from './store/ui';
import {IState} from './store/data';
import * as installation from './installation/store';
import * as explorer from './explorer/store';
import * as account from './account/store';

//create the app state and root reducer
//    UI Management
interface IUIState {
  global?: ui.IUI,
  installation?: installation.IState,
  explorer?: explorer.IState,
  account?: account.IState
}
export const uiReducer = combineReducers<IUIState>({
  global: ui.reducer,
  installation: installation.reducer,
  explorer: explorer.reducer,
  account: account.reducer
})
//   TOP LEVEL: UI, Data
export interface IAppState {
  ui?: IUIState,
  data?: IState
}

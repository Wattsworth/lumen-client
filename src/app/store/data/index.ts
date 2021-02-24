import { combineReducers} from '@ngrx/store';

import * as types from './types';
import * as reducers from './reducer';

export * from './types';

export interface IState {
  nilms: types.INilmState;
  dataApps: types.IDataAppState;
  dbFolders: types.IDbFolderState;
  dbStreams: types.IDbStreamState;
  dbElements: types.IDbElementState;
  users: types.IUserState;
  userGroups: types.IUserGroupState;
  permissions: types.IPremissionState;
  dataViews: types.IDataViewState;
  annotations: types.IAnnotationState
}

export const reducer = combineReducers({
  nilms: reducers.nilmReducer,
  dataApps: reducers.dataAppReducer,
  dbFolders: reducers.dbFolderReducer,
  dbStreams: reducers.dbStreamReducer,
  dbElements: reducers.dbElementReducer,
  permissions: reducers.permissionReducer,
  users: reducers.userReducer,
  userGroups: reducers.userGroupReducer,
  dataViews: reducers.dataViewReducer,
  annotations: reducers.annotationReducer
});
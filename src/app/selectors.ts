import { createSelector } from '@ngrx/store';
import {IAppState} from './app.store';
import * as data from './store/data';

//Top level selectors
export const data_ = (state:IAppState) => state.data
export const ui_ = (state:IAppState) => state.ui


//Selectors for data reducers
export const nilms_ = createSelector(data_, (state) => state.nilms.entities);
export const dataApps_ = createSelector(data_, (state) => state.dataApps.entities);
export const dbFolders_ = createSelector(data_, (state) => state.dbFolders.entities);
export const dbStreams_ = createSelector(data_, (state) => state.dbStreams.entities);
export const dbElements_ = createSelector(data_, (state) => state.dbElements.entities);
export const users_ = createSelector(data_, (state) => state.users);
export const userGroups_ = createSelector(data_, (state) => state.userGroups);
export const permissions_ = createSelector(data_, (state) => state.permissions.entities);
export const dataViews_ = createSelector(data_, (state) => state.dataViews.entities);
export const annotations_ = createSelector(data_, (state) => state.annotations.entities);

//Selectors for UI reducers
export const global_UI_ = createSelector(ui_, (state) => state.global);
export const installation_UI_ = createSelector(ui_, (state) => state.installation);
export const explorer_UI_ = createSelector(ui_, (state) => state.explorer);
export const account_UI_ = createSelector(ui_, (state) => state.account);

//Selectors for UI Explorer reducers
export const annotation_UI_Ex_ = createSelector(explorer_UI_, (state) => state.annotation);
export const measurement_UI_Ex_ = createSelector(explorer_UI_, (state) => state.measurement);
export const interfaces_UI_Ex_ = createSelector(explorer_UI_, (state) => state.interfaces);
export const plot_UI_Ex_ = createSelector(explorer_UI_, (state) => state.plot);



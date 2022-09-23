import {createAction, props} from '@ngrx/store'
import { IDataSet, IEventsSet, IDbElement, IEventStream } from '../../../store/data';
import { IState } from './types';

import { IAxisSettings, IRange } from '../helpers';

//Plot Actions
export const hideElement = createAction('[EXPLORER: PLOT] Hide element ', props<{id: number}>());
export const plotElement = createAction('[EXPLORER: PLOT] Show element', props<{element: IDbElement}>());
export const hideEvents = createAction('[EXPLORER: PLOT] Hide events', props<{id: string}>());
export const hideEventsAndDuplicates = createAction('[EXPLORER: PLOT] Hide events and duplicates', props<{id: string}>());

export const plotEvents = createAction('[EXPLORER: PLOT] Show events', props<{stream: IEventStream}>());
export const hideAllElements = createAction('[EXPLORER: PLOT] Hide all elements');
export const hideAllEvents = createAction('[EXPLORER: PLOT] Hide all events');

export const setElementAxis = createAction('[EXPLORER: PLOT] Set element axis', props<{element: IDbElement, axis: string}>());
export const showPlot = createAction('[EXPLORER: PLOT] Show plot');
export const hidePlot = createAction('[EXPLORER: PLOT] Hide plot');
export const showDateSelector = createAction('[EXPLORER: PLOT] Show date selector');
export const hideDateSelector = createAction('[EXPLORER: PLOT] Hide date selector');
export const addingPlotData = createAction('[EXPLORER: PLOT] Adding plot data');
export const addingNavData = createAction('[EXPLORER: PLOT] Adding nav data');
export const addPlotData = createAction('[EXPLORER: PLOT] Add plot data', props<{data: IDataSet}>());
export const addPlotEventData = createAction('[EXPLORER: PLOT] Add plot event data', props<{data: IEventsSet}>());
export const addNavData = createAction('[EXPLORER: PLOT] Add nav data', props<{data: IDataSet}>());
export const addNavEventData = createAction('[EXPLORER: PLOT] Add nav event data', props<{data: IEventsSet}>());
export const resetTimeRanges = createAction('[EXPLORER: PLOT] Reset time ranges');
export const setPlotTimeRange = createAction('[EXPLORER: PLOT] Set plot time range', props<{range: IRange}>());
export const setNavTimeRange = createAction('[EXPLORER: PLOT] Set nav time range', props<{range: IRange}>());
export const setNavRangeToPlotRange = createAction('[EXPLORER: PLOT] Set nav range to plot range');
export const toggleZoomLock = createAction('[EXPLORER: PLOT] Toggle zoom lock');
export const disableZoomLock = createAction('[EXPLORER: PLOT] Disable zoom lock');
export const toggleDataCursor = createAction('[EXPLORER: PLOT] Toggle data cursor');
export const disableDataCursor = createAction('[EXPLORER: PLOT] Disable data cursor');
export const toggleLiveUpdate = createAction('[EXPLORER: PLOT] Toggle live update');
export const disableLiveUpdate = createAction('[EXPLORER: PLOT] Disable live update');
export const toggleDataEnvelope = createAction('[EXPLORER: PLOT] Toggle data envelope');
export const toggleAnnotations = createAction('[EXPLORER: PLOT] Toggle annotations');
export const setLiveUpdateInterval = createAction('[EXPLORER: PLOT] Set live update interval', props<{rate: number}>());

//Axis Settings
export const autoScaleAxis = createAction('[EXPLORER: PLOT] Auto scale axis', props<{axis: String}>());
export const setNilmLoaded = createAction('[EXPLORER: PLOT] Set nilms loaded');
export const setLeftAxisSettings = createAction('[EXPLORER: PLOT] Set left axis settings', props<{settings: IAxisSettings}>());
export const setRightAxisSettings = createAction('[EXPLORER: PLOT] Set right axis settings', props<{settings: IAxisSettings}>());
export const setTimeAxisSettings = createAction('[EXPLORER: PLOT] Set time axis settings', props<{settings: IAxisSettings}>());
export const toggleTimeAxisSettings = createAction('[EXPLORER: PLOT] Toggle time axis settings');
export const toggleLeftAxisSettings = createAction('[EXPLORER: PLOT] Toggle left axis settings');
export const toggleRightAxisSettings = createAction('[EXPLORER: PLOT] Toggle right axis settings');

//Data Views
export const setDataViewsLoaded = createAction('[EXPLORER: PLOT] Set data views loaded');
export const showPublicDataViews = createAction('[EXPLORER: PLOT] Show public data views', props<{show: boolean}>());
export const setDataViewFilterText = createAction('[EXPLORER: PLOT] Set data view filter text', props<{filter: string}>());
export const restoreDataView = createAction('[EXPLORER: PLOT] Restore data view', props<{saved_state: IState}>());

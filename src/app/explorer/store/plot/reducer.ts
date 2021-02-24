import { createReducer, on } from '@ngrx/store';
import * as actions from './actions' ;
import { IState } from './types';
import {
  IDataSet,
} from '../../../store/data'
import {
  defaultPlotState
} from './initial-state'
import {
  IRange,
} from '../helpers'
import { defaultData } from 'app/store/data/initial-state';

export const reducer = createReducer(
  defaultPlotState,
  // plot an element, auto select the appropriate axis
  on(actions.plotElement, (state: IState, {element}) => {
    //first try to plot element on the left
    if (state.left_elements.length == 0 ||
      state.left_units == element.units) {
      return {...state, 
        left_units: element.units,
        left_elements: [...state.left_elements, element.id]
      }
    }
    //next try to plot element on the right
    if (state.right_elements.length == 0 ||
      state.right_units == element.units) {
        return {...state, 
          right_units: element.units,
          right_elements: [...state.right_elements, element.id]
        }
    }
    //error, cannot plot this element
    console.log('error cannot plot unit:', element.units);
    return state;
  }),
  //hide a plotted element
  on(actions.hideElement, (state: IState, {id}) => {
    return {...state, 
      left_elements: state.left_elements.filter(eid=>eid!=id),
      right_elements: state.right_elements.filter(eid=>eid!=id)
    };
  }),
  //hide all elements (clear left_elements and right_elements)
  on(actions.hideAllElements, (state: IState) => ({...state, leftElements: [], right_elements: []})),
  //change a plotted element's axis
  on(actions.setElementAxis, (state: IState, {element, axis}) => {
      if (axis == 'right') {
        //is this element already on the right?
        if(state.right_elements.indexOf(element.id)>-1){
          return state; }
        //can this element be added to the axis- must have the same units
        if(state.right_elements.length >0 && state.right_units != element.units){
          console.log("cannot switch element to right axis- units do not match")
          return state;
        }
        //all checks pass, do the move
        return {...state,
          left_elements: state.left_elements.filter(id=>id!=element.id),
          right_elements: [...state.right_elements, element.id],
          right_units: element.units
        }
      }
      if (axis == 'left') {
        //is this element already on the left?
        if(state.left_elements.indexOf(element.id)>-1){
          return state; }
        //can this element be added to the axis- must have the same units
        if(state.left_elements.length >0 && state.left_units != element.units){
          console.log("cannot switch element to left axis- units do not match")
          return state;
        }
        //all checks pass, do the move
        return {...state,
          right_elements: state.right_elements.filter(id=>id!=element.id),
          left_elements: [...state.right_elements, element.id],
          left_units: element.units
        }
      }
      console.log(`Unknown axis ${axis}`);
      return state;
  }),
  //show the plot window
  on(actions.showPlot,(state: IState) => ({...state, show_plot: true})),
  //hide the plot window
  on(actions.hidePlot,(state: IState) => ({...state, show_plot: false})),
  //show the plot date selector
  on(actions.showDateSelector,(state: IState) => ({...state, show_date_selector: true})),
  //hide the plot date selector
  on(actions.hideDateSelector,(state: IState) => ({...state, show_date_selector: false})),
  //adding data: indicate a server request has been made
  on(actions.addingPlotData,(state: IState) => ({...state, adding_plot_data: true})),
  //add data retrieved from server to the plot dataset
  on(actions.addPlotData,(state: IState, {data})=>{
    console.log("here?")
    let _data = handleMissingData(
      state.plot_data,
      data,
      state.plot_time.min,
      state.plot_time.max)
    //set plot time range if bounds are null
    return {...state,
      plot_time: setTimeRange(state.plot_time, _data),
      plot_data: {...state.plot_data, ..._data},
      adding_plot_data: false};
  }),
  //adding nav data: indicate a server request has been made
  on(actions.addingNavData,(state: IState) => ({...state, adding_nav_data: true})),
  //add data retrieved from server to the nav dataset
  on(actions.addNavData,(state: IState, {data})=>{
    let _data = handleMissingData(
      state.nav_data,
      data,
      state.nav_time.min,
      state.nav_time.max)
    //set plot time range if bounds are null
    return {...state,
      nav_data: {...state.nav_data, ..._data},
      nav_time: setTimeRange(state.nav_time, _data),
      adding_nav_data: false
    }
  }),
  //reset the plot time ranges
  on(actions.resetTimeRanges,(state: IState) => ({...state, 
    plot_time: {min: null, max:null}, 
    nav_time: {min: null, max: null}})),
  //set plot time range
  on(actions.setPlotTimeRange,(state: IState, {range}) => ({...state, plot_time: range})),
  //set nav time range
  on(actions.setNavTimeRange,(state: IState, {range}) => ({...state, nav_time: range})),
  //set nav range to the plot range
  on(actions.setNavRangeToPlotRange,(state: IState) => ({...state, nav_time: state.plot_time})),
  //toggle whether the nav zoom window is locked
  on(actions.toggleZoomLock,(state: IState) => ({...state, nav_zoom_lock: !state.nav_zoom_lock})),
  //disable the nav zoom window lock
  on(actions.disableZoomLock,(state: IState) => ({...state, nav_zoom_lock: false})),
  //toggle whether the data cursor is displayed
  on(actions.toggleDataCursor,(state: IState) => ({...state, data_cursor: !state.data_cursor})),
  //hide the data cursor
  on(actions.disableDataCursor,(state: IState) => ({...state, data_cursor: false})),
  //set the frequency of live updates in seconds (must be at least 1)
  on(actions.setLiveUpdateInterval,(state: IState, {rate}) => ({...state, live_update_interval:  Math.max(1,rate)})),
  //toggle whether the view is live updating
  on(actions.toggleLiveUpdate,(state: IState) => ({...state, live_update: !state.live_update })),
  //disable the live update
  on(actions.disableLiveUpdate,(state: IState) => ({...state, live_update: false })),
  //toggle whether the data envelope is plotted
  on(actions.toggleDataEnvelope,(state: IState) => ({...state, show_data_envelope: !state.show_data_envelope })),
  //toggle whether annotation is shown
  on(actions.toggleAnnotations,(state: IState) => ({...state, show_annotations: !state.show_data_envelope })),
  //toggle whether public data views are displayed
  on(actions.showPublicDataViews,(state: IState) => ({...state, show_public_data_views: !state.show_public_data_views })),
  //set filter text for data view search bar
  on(actions.setDataViewFilterText,(state: IState, {filter}) => ({...state, data_view_filter_text: filter })),
  //auto scale specified axis to include all available data
  on(actions.autoScaleAxis,(state: IState, {axis}) => {
    if(axis=='left'){
      return {...state, plot_y1: {min: null, max: null, }}
    }
    if(axis=='right'){
      return {...state, plot_y2: {min: null, max: null, }}
    }
    console.log(`error, invalid axis ${axis}`)
    return state;
  }),
  //update left axis settings
  on(actions.setLeftAxisSettings,(state: IState, {settings}) => ({...state, left_axis_settings: settings })),
  //update right axis settings
  on(actions.setRightAxisSettings,(state: IState, {settings}) => ({...state, right_axis_settings: settings })),
  //show/hide right axis settings
  on(actions.toggleRightAxisSettings,(state: IState) => ({...state, show_right_axis_settings: !state.show_right_axis_settings })),
  //show/hide left axis settings
  on(actions.toggleLeftAxisSettings,(state: IState) => ({...state, show_left_axis_settings: !state.show_left_axis_settings })),
  //update time axis settings
  on(actions.setTimeAxisSettings,(state: IState, {settings}) => ({...state, time_axis_settings: settings})),
  //show/hide time axis settings
  on(actions.toggleTimeAxisSettings,(state: IState) => ({...state, show_time_axis_settings: !state.show_time_axis_settings })),
  //restore view from a saved redux object
  on(actions.restoreDataView,(state: IState, {saved_state}) => ({...state,
     ...saved_state, 
    //TODO: do the nav_data and plot_data attributes need to change??
    //override data retrieval view states
     nilms_loaded: state.nilms_loaded, 
     data_views_loaded: state.data_views_loaded })),
  //set flag to indicate nilms are loaded
  on(actions.setNilmLoaded,(state: IState) => ({...state, nilms_loaded: true })),
  //set flag to indicate data views are loaded
  on(actions.setDataViewsLoaded,(state: IState) => ({...state, data_views_loaded: true })),
)
   
// ----- Helper Functions ------

function setTimeRange(range: IRange, data: IDataSet) {
  let autoRange = { min: range.min, max: range.max }
  console.log("set range")
  if (data == {})
    return range;
  if (range.min == null && data != {}) {
    let possibleMinTimes = Object.keys(data)
      .map(id => data[id].start_time)
      .filter(time => time!=null)
      .sort((a, b) => a - b)
    if(possibleMinTimes.length>0) 
      autoRange.min = possibleMinTimes[0]
  }
  if (range.max == null && data != {}) {
    let possibleMaxTimes = Object.keys(data)
      .map(id => data[id].end_time)
      .filter(time => time!=null)
      .sort((a, b) => b - a)
    if(possibleMaxTimes.length>0) 
      autoRange.max = possibleMaxTimes[0]
  }
  console.log("computed: ", autoRange)
  return autoRange;
}

//fill in missing data by updating existing data with the requested time bounds
//or creating new entries with no data using the requested time bounds
function handleMissingData(
  currentData: IDataSet,
  newData: IDataSet,
  startTime: number,
  endTime: number): IDataSet {
  return Object.keys(newData)
    .reduce((acc: IDataSet, id: string): IDataSet => {
      //OK: pass valid data through
      if (newData[id].type != 'error') {
        acc[id] = newData[id];
        return acc;
      }
      //ERROR: data could not be retrieved! 
      //if valid data exsists, update it with the requested time bounds
      if (currentData[id] !== undefined) {
        acc[id] = {...currentData[id], 
          start_time: startTime, end_time: endTime, valid: false}
        return acc;
      } else {
        //there is no valid data for this element, create an empty record
        acc[id] = {...defaultData, 
          start_time: startTime,
          end_time: endTime,
          data: [],
          type: 'raw',
          valid: false
        }
        return acc;
      }
    }, <IDataSet>{});
}

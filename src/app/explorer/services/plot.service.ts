import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';
import {
  PlotActions,
  IRange
} from '../store';
import { IAppState } from '../../app.store';
import { MessageService } from '../../services/';
import {
  IDbElement,
  IDataSet
} from '../../store/data';
import {
  IAxisSettings
} from '../store';
import {
  DataService,
  DbElementService,
} from '../../services';


@Injectable()
export class PlotService {

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private messageService: MessageService,
    private dataService: DataService,
    private elementService: DbElementService
  ) { }

  // add element to specified axis
  //
  public plotElement(element, axis: string = 'either') {
    this.elementService.assignColor(element);
    this.ngRedux.dispatch({
      type: PlotActions.PLOT_ELEMENT,
      payload: element
    })
  }

  // remove element from plot
  //
  public hideElement(element) {
    this.ngRedux.dispatch({
      type: PlotActions.HIDE_ELEMENT,
      payload: element
    })
    this.elementService.removeColor(element);
  }

  // remove all elements from the plot
  /*public hideAllElements() {
    let elementRecords = this.ngRedux.getState().data.dbElements;
    Object.keys(elementRecords)
      .map(id => {
        this.hideElement(elementRecords[id]);
      })
  }*/

  public setElementAxis(element: IDbElement, axis: string) {
    //if the destination axis has elements plotted, this element
    //must have the same units, otherwise return false
    if (axis == "left") {
      if (this.ngRedux.getState().ui.explorer.plot.left_elements.length > 0 &&
        element.units != this.ngRedux.getState().ui.explorer.plot.left_units)
        return false;
    } else if (axis == "right") {
      if (this.ngRedux.getState().ui.explorer.plot.right_elements.length > 0 &&
        element.units != this.ngRedux.getState().ui.explorer.plot.right_units)
        return false;
    } else {
      console.log(`invalid axis ${axis}`)
      return false;
    }
    this.ngRedux.dispatch({
      type: PlotActions.SET_ELEMENT_AXIS,
      payload: {
        element: element,
        axis: axis
      }
    })
  }
  public showPlot() {
    if (this.ngRedux.getState().ui.explorer.plot.show_plot == false)
      this.ngRedux.dispatch({
        type: PlotActions.SHOW_PLOT
      })
  }
  public showDateSelector() {
    this.ngRedux.dispatch({
      type: PlotActions.SHOW_DATE_SELECTOR
    })
  }
  public hideDateSelector() {
    this.ngRedux.dispatch({
      type: PlotActions.HIDE_DATE_SELECTOR
    })
  }

  public hidePlot() {
    if (this.ngRedux.getState().ui.explorer.plot.show_plot)
      this.ngRedux.dispatch({
        type: PlotActions.HIDE_PLOT
      })
  }
  public loadPlotData(
    elements: IDbElement[],
    timeRange: IRange,
    resolution: number
  ) {

    let existingData = this.ngRedux.getState().ui.explorer.plot.plot_data;
    let neededElements = this.findNeededElements(elements, existingData, timeRange);
    if (neededElements.length == 0)
      return; //nothing to do
    this.ngRedux.dispatch({
      type: PlotActions.ADDING_PLOT_DATA
    });
    //add padding to plot data if ranges are not null
    this.dataService.loadData(
      timeRange.min, timeRange.max, 
      neededElements, resolution, 0.25)
      .subscribe(data => {
        this.ngRedux.dispatch({
          type: PlotActions.ADD_PLOT_DATA,
          payload: data
        })
      },
      error => {
        //nothing came back so create dummy error entries
        this.ngRedux.dispatch({
          type: PlotActions.ADD_PLOT_DATA,
          payload: neededElements.reduce((acc,e) => {
            acc[e.id] = {
              'element_id': e.id,
              'type': 'error',
              'data': [],
              'start_time': timeRange.min==null?0:timeRange.min,
              'end_time': timeRange.max==null?0:timeRange.max
            }
            return acc
          },{}) 
        })
      })
  }
  public loadNavData(
    elements: IDbElement[],
    timeRange: IRange,
    resolution
  ) {
    let existingData = this.ngRedux.getState().ui.explorer.plot.nav_data;
    let neededElements = this.findNeededElements(elements, existingData, timeRange);
    if (neededElements.length == 0)
      return; //nothing to do
    this.ngRedux.dispatch({
      type: PlotActions.ADDING_NAV_DATA
    });
    this.dataService.loadData(
      timeRange.min, timeRange.max, neededElements, resolution)
      .subscribe(data => {
        this.ngRedux.dispatch({
          type: PlotActions.ADD_NAV_DATA,
          payload: data
        })
      },
      error => {
        this.ngRedux.dispatch({
          type: PlotActions.ADD_NAV_DATA,
          payload: neededElements.reduce((acc,e) => {
            acc[e.id] = {
              'element_id': e.id,
              'type': 'error',
              'data': [],
              'start_time': timeRange.min==null?0:timeRange.min,
              'end_time': timeRange.max==null?0:timeRange.max
            }
            return acc
          },{}) //nothing came back so create dummy error entries
        })
      })
  }

  public toggleNavZoomLock() {
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_ZOOM_LOCK
    });
  }
  public disableNavZoomLock() {
    this.ngRedux.dispatch({
      type: PlotActions.DISABLE_ZOOM_LOCK
    });
  }
  public toggleDataCursor() {
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_DATA_CURSOR
    });
  }
  public disableDataCursor() {
    this.ngRedux.dispatch({
      type: PlotActions.DISABLE_DATA_CURSOR
    });
  }
  public setLiveUpdateInterval(rate: number){
    this.ngRedux.dispatch({
      type: PlotActions.SET_LIVE_UPDATE_INTERVAL,
      payload: rate
    });
  }
  public toggleLiveUpdate() {
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_LIVE_UPDATE
    });
  }
  public disableLiveUpdate() {
    this.ngRedux.dispatch({
      type: PlotActions.DISABLE_LIVE_UPDATE
    });
  }
  public toggleShowDataEnvelope() {
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_SHOW_DATA_ENVELOPE
    });
  }
  public setPlotTimeRange(range: IRange) {
    this.ngRedux.dispatch({
      type: PlotActions.SET_PLOT_TIME_RANGE,
      payload: range
    })
  }
  public setNavTimeRange(range: IRange) {
    this.ngRedux.dispatch({
      type: PlotActions.SET_NAV_TIME_RANGE,
      payload: range
    })
  }
  public setNavRangeToPlotRange() {
    this.ngRedux.dispatch({
      type: PlotActions.SET_NAV_RANGE_TO_PLOT_RANGE
    })
  }
  public autoScaleAxis(axis: string) {
    this.ngRedux.dispatch({
      type: PlotActions.AUTO_SCALE_AXIS,
      payload: axis
    })
  }

  public resetTimeRanges() {
    //remove main plot time range
    this.ngRedux.dispatch({
      type: PlotActions.RESET_TIME_RANGES
    })
  }

  public setTimeRangeToNow(){
    let now = Date.now();
    const NAV_NOW_INTERVAL = 60 * 60 * 1000; //1 hour
    const PLOT_NOW_INTERVAL = 20 * 60 * 1000; //20 minutes
    this.setPlotTimeRange({
      min: now - PLOT_NOW_INTERVAL,
      max: now
    })
    this.setNavTimeRange({
      min: now - NAV_NOW_INTERVAL,
      max: now
    });
  }
  public autoScaleTime() {
    this.ngRedux.dispatch({
      type: PlotActions.SET_PLOT_TIME_RANGE,
      payload: {min: null, max: null}
    })
  }

  public setDataViewFilterText(text: string) {
    this.ngRedux.dispatch({
      type: PlotActions.SET_DATA_VIEW_FILTER_TEXT,
      payload: text
    })
  }
  public setShowPublicDataViews(show: boolean) {
    this.ngRedux.dispatch({
      type: PlotActions.SET_SHOW_PUBLIC_DATA_VIEWS,
      payload: show
    })
  }

  public setLeftAxisSettings(settings: IAxisSettings){
    this.ngRedux.dispatch({
      type: PlotActions.SET_LEFT_AXIS_SETTINGS,
      payload: settings
    })
  }

  public toggleLeftAxisSettings(){
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_LEFT_AXIS_SETTINGS
    })
  }

  public setRightAxisSettings(settings: IAxisSettings){
    this.ngRedux.dispatch({
      type: PlotActions.SET_RIGHT_AXIS_SETTINGS,
      payload: settings
    })
  }

  public toggleRightAxisSettings(){
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_RIGHT_AXIS_SETTINGS
    })
  }

  public setTimeAxisSettings(settings: IAxisSettings){
    this.ngRedux.dispatch({
      type: PlotActions.SET_TIME_AXIS_SETTINGS,
      payload: settings
    })
  }

  public toggleTimeAxisSettings(){
    this.ngRedux.dispatch({
      type: PlotActions.TOGGLE_TIME_AXIS_SETTINGS
    })
  }

  //set flag to indicate nilms have been loaded
  //
  public setNilmsLoaded(){
    this.ngRedux.dispatch({
      type: PlotActions.SET_NILMS_LOADED
    })
  }
  //set flag to indicate data views have been loaded
  //
  public setDataViewsLoaded(){
    this.ngRedux.dispatch({
      type: PlotActions.SET_DATA_VIEWS_LOADED
    })
  }


  ///------ helpers ------------

  //PUBLIC: 
  buildDataset(
    elements: IDbElement[],
    data: IDataSet,
    axis: number,
    showEnvelope: boolean) {
    
    return elements.map(element => {
      if (data[element.id] === undefined || data[element.id] == null)
        return null;
      //use custom display_name if present
      let label = element.name;
      if (element.display_name != "")
        label = element.display_name;
      //if the data is corrupt add a warning icon
      if (data[element.id].valid == false) {
        // add SVG icon to legend (not managed by Angular)
        label += ' <svg aria-hidden="true" data-prefix="fas" data-icon="exclamation-circle" class="svg-inline--fa fa-exclamation-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>';
      }
      let baseConfig = {
        label: label,
        yaxis: axis,
        //bars: { show: false, barWidth: 2 },
        //points: { show: false },
        lines: { show: false },
        color: element.color,
        data: data[element.id].data,
        default_min: element.default_min,
        default_max: element.default_max
      }

      switch (data[element.id].type) {
        case 'raw':
          switch (element.display_type) {
            case 'continuous':
              return Object.assign({}, baseConfig,
                {
                  lines: { show: true },
                });
            case 'discrete':
              return Object.assign({}, baseConfig,
                {
                  points: { show: true, radius: 2 },
                });
            case 'event':
              return Object.assign({}, baseConfig,
                {
                  bars: { show: true, barWidth: 2 },
                });
          }
        case 'decimated':
          let opacity = showEnvelope ? 0.2: 0.0;
          switch (element.display_type) {
            case 'continuous':
              return Object.assign({}, baseConfig,
                {
                  fillArea: [{ opacity: opacity, representation: "asymmetric" }],
                  lines: { show: true }
                });
            case 'discrete':
              return Object.assign({}, baseConfig,
                {
                  fillArea: [{ opacity: opacity, representation: "asymmetric" }],
                  points: { show: true, radius: 1 }
                });
          }
        case 'interval':
          return Object.assign({}, baseConfig,
            {
              yaxis: baseConfig.yaxis + 2,
              lines: {
                lineWidth: 5,
              },
              points: {
                show: true
              },
              default_min: null,
              default_max: null
            })
        default:
          console.log("unknown data type: ", data[element.id].type)
      }
      return
    }).filter(data => data != null)
  }

  //isPlottable: return true if units can be plotted
  // (if units match an existing axis or an axis is empty)
  //
  isPlottable(units: string){
    let state = this.ngRedux.getState();
    let plotState = state.ui.explorer.plot;
    if (plotState.left_units == units ||
      plotState.right_units == units ||
      plotState.left_elements.length == 0 ||
      plotState.right_elements.length == 0) {
      return true;
    }
    return false;
  }

  //isPlotted: return true if the element is currently 
  // shown on the plot
  isPlotted(element: IDbElement){
    let state = this.ngRedux.getState();
    let plotState = state.ui.explorer.plot;
    if (_.includes(plotState.left_elements, element.id) ||
      _.includes(plotState.right_elements, element.id)) {
      return true;
    }
    return false;
  }

  //getPlotData: return IDataSet of plot data
  //
  getPlotData(){
    let state = this.ngRedux.getState();
    let plotState = state.ui.explorer.plot;
    return plotState.plot_data;
  }
  //PRIVATE
  private findNeededElements(
    elements: IDbElement[],
    existingData: IDataSet,
    timeRange: IRange
  ) {
    return elements
      .filter(e => {
        let data = existingData[e.id];
        if (data === undefined || data == null) {
          return true;
        } else if (data.start_time != timeRange.min || data.end_time != timeRange.max) {
          return true;
        } else {
          return false;
        }
      })      
  }


}
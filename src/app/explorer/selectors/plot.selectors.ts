
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';
import {createSelector, select, Store} from '@ngrx/store'

import * as _ from 'lodash-es';

import { IAppState } from '../../app.store';

import {
  IDbElement,
  IDbStream,
  IDataView,
  IEventStream,
  IEventOverflow
} from '../../store/data';
import {
  dataViews_,
  data_,
  dbElements_,
  dbStreams_,
  eventStreams_,
  nilms_,
  plot_UI_Ex_
} from '../../selectors'
import { IAxisSettings } from '../store';


const selectElements = (state: IAppState) => state.data.dbElements;
const selectLeftElementIDs = (state: IAppState) => state.ui.explorer.plot.left_elements;


export const leftElements = createSelector(
  selectElements, selectLeftElementIDs, 
  (elements, ids)=>{
    if (ids && elements) {
      return ids.map((id: number) => elements.entities[id]);
    } else {
      return [];
    }
  }
  )


@Injectable()
export class PlotSelectors {

  data$ = this.store.pipe(select(data_));
  elements$ = this.store.pipe(select(dbElements_))
  eventStreams$ = this.store.pipe(select(eventStreams_))
  streams$ = this.store.pipe(select(dbStreams_))
  nilms$ = this.store.pipe(select(nilms_))
  dataViews$ = this.store.pipe(select(dataViews_))

  leftElementIDs$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.left_elements)));
  leftAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.left_axis_settings)));
  showLeftAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_left_axis_settings)));
  rightElementIDs$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.right_elements)));
  rightAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.right_axis_settings)));
  showRightAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_right_axis_settings)));
  timeAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.time_axis_settings)));
  showTimeAxisSettings$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_time_axis_settings)));
  showPlot$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_plot)));
  showDateSelector$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_date_selector)));
  plotTimeRange$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.plot_time)));
  plotData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.plot_data)));
  plotEventData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.plot_event_data)))
  addingPlotData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.adding_plot_data)));
  navTimeRange$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.nav_time)));
  navData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.nav_data)));
  navEventData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.nav_event_data)))
  addingNavData$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.adding_nav_data)));
  navZoomLock$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.nav_zoom_lock)));
  dataCursor$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.data_cursor)));
  plotY1$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.plot_y1)));
  plotY2$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.plot_y2)));
  liveUpdate$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.live_update)));
  dataViewFilterText$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.data_view_filter_text)));
  showPublicDataViews$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_public_data_views)));
  leftElementUnits$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.left_units)));
  rightElementUnits$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.right_units)));
  nilmsLoaded$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.nilms_loaded)));
  dataViewsLoaded$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.data_views_loaded)));
  showDataEnvelope$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_data_envelope)));
  showAnnotations$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.show_annotations)));
  liveUpdateInterval$ = this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.live_update_interval)));
  plottedEventStreamIDs$ =  this.store.pipe(select(createSelector(plot_UI_Ex_, state=>state.event_streams)));
  
  public plottedEventStreams$: Observable<IEventStream[]>
  public leftElements$: Observable<IDbElement[]>
  public rightElements$: Observable<IDbElement[]>

  //For the axis settings toolbars (can't change the redux state objects)
  public leftAxisSettingsMutable$: Observable<IAxisSettings>;
  public rightAxisSettingsMutable$: Observable<IAxisSettings>;
  public timeAxisSettingsMutable$: Observable<IAxisSettings>;

  //both left and right elements
  public plottedElements$: Observable<IDbElement[]>
  public isPlotEmpty$: Observable<boolean>

  //streams containing the plotted elements
  public plottedStreams$: Observable<IDbStream[]>

  //is either nav or data loading?
  public isDataLoading$: Observable<boolean>

  //data views that match current filter settings
  public filteredDataViews$: Observable<IDataView[]>

  //is any of the data displayed as intervals?
  public isIntervalDataDisplayed$: Observable<boolean>

  //are the errors (invalid elements) in the data?
  public isPlotDataValid$: Observable<boolean>;

  //are there too many events to display?
  public eventOverflows$: Observable<IEventOverflow[]>;

  
  constructor(
    private store: Store
  ) {

    this.plottedEventStreams$ = combineLatest(
      [this.eventStreams$,this.plottedEventStreamIDs$]).pipe(
      map(([streams, ids]) => {
        return _.flatMap(ids, id=>Object
          .values(streams)
          .filter(stream => stream.id==id)
        );
        
      }),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      //.share()
      startWith([]));

    this.eventOverflows$ = combineLatest(
      [this.eventStreams$,this.plottedEventStreamIDs$, this.plotEventData$]).pipe(
        map(([streams, ids, events]) => {
          let overflow_ids = ids.filter(id => id in events && events[id].count>0 && events[id].events.length==0);
          return overflow_ids.map(id => {
            let name = streams[id].name;
            if (streams[id].plot_settings.display_name != '')
              name = streams[id].plot_settings.display_name;
            return {name: name, count: events[id].count}})
          
        }), distinctUntilChanged((x, y) => _.isEqual(x, y)),
        //.share()
        startWith([]));

    this.leftElements$ = combineLatest(
      [this.elements$,this.leftElementIDs$]).pipe(
      map(([elements, ids]) => {
        return ids.map(id => elements[id]);
      }),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      //.share()
      startWith([]));


    this.rightElements$ = combineLatest(
      [this.elements$, this.rightElementIDs$]).pipe(
      map(([elements, ids]) => {
        return ids.map(id => elements[id])
      }),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      //.share()
      startWith([]));


    this.plottedElements$ = combineLatest(
      [this.leftElements$, this.rightElements$]).pipe(
      map(([left, right]) => left.concat(right)),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      //.share()
      startWith([]));

    this.plottedStreams$ = combineLatest(
      [this.plottedElements$, this.streams$]).pipe(
      map(([elements, streams]) => {
        return _.uniq(elements.map(e => e.db_stream_id))
          .map(id => streams[id])
          .filter(stream => stream !== undefined)
      }));
      //.share()


    this.isPlotEmpty$ = combineLatest(
      [this.leftElementIDs$,this.rightElementIDs$]).pipe(
      map(([left, right]) => ((left.length == 0) && (right.length == 0))));
      //.share()
      //.startWith(true)

    this.isDataLoading$ = combineLatest(
      [this.addingNavData$,this.addingPlotData$]).pipe(
      map(([nav, plot]) => nav && plot))
      //.share()
    
    let viewArray = this.dataViews$
      .pipe(map(views => { //convert views to an array
        return Object.keys(views)
          .reduce((acc, id) => {
            acc.push(views[id]);
            return acc;
          }, [])
      }));
    
    this.filteredDataViews$ = combineLatest(
      [viewArray,this.dataViewFilterText$, this.showPublicDataViews$]).pipe(
      map(([views, filterText, includePublic]) => {
        return views
          //include public views only if includePublic is true
          .filter(view => view.owner || includePublic)
          //show views where filterText is in the name or description
          .filter(view => {
            let searchableText = view.name;
            //ignore case
            let searchText = filterText.toLowerCase();
            //only include the description if it is not null
            if (view.description != null)
              searchableText += view.description;
            return searchableText.toLowerCase().indexOf(searchText) >= 0
          })
      }));
      //.share()

    this.isIntervalDataDisplayed$ = combineLatest(
      [this.plottedElements$, this.plotData$]).pipe(
      map(([elements, data]) => elements
        .map(e => data[e.id])
        .filter(data => data !== undefined)),
      map(dataset => {
        return dataset.reduce((isInterval, data) => {
          return isInterval || data.type == 'interval'
        }, false)
      }));
      //.share()

    this.isPlotDataValid$ = combineLatest(
      [this.plottedElements$,this.plotData$]).pipe(
      map(([elements, data]) => elements
        .map(e => data[e.id])
        .filter(data => data !== undefined)),
      map((dataset:any) => {
        return Object
          .keys(dataset)
          .reduce((isValid, id) => isValid && dataset[id].valid, true)
      }));
      //.share()

      //For the axis settings toolbars (can't change the redux state objects)
      this.leftAxisSettingsMutable$ = this.leftAxisSettings$.pipe(map(state=>Object.assign({},state)));
      this.rightAxisSettingsMutable$ = this.rightAxisSettings$.pipe(map(state=>Object.assign({},state)));
      this.timeAxisSettingsMutable$ = this.timeAxisSettings$.pipe(map(state=>Object.assign({},state)));

  }
}
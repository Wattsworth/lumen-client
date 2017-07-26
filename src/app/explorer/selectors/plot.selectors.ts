import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store';
import * as _ from 'lodash';

import { IAppState } from '../../app.store';
import {
  IRange
} from '../store';
import {
  IState,
  INilmRecords,
  IDbElement,
  IDbElementRecords,
  IDbStream,
  IDbStreamRecords,
  IDataSet,
  IDataViewRecords,
  IDataView
} from '../../store/data';

export const PLOT_REDUX= ['ui','explorer','plot'];

@Injectable()
export class PlotSelectors {

  @select(['data']) data$: Observable<IState>;
  @select(['data', 'dbElements']) elements$: Observable<IDbElementRecords>;
  @select(['data', 'dbStreams']) streams$: Observable<IDbStreamRecords>;
  @select(['data', 'nilms', 'entities']) nilms$: Observable<INilmRecords>;

  @select(['data', 'dataViews']) dataViews$: Observable<IDataViewRecords>;

  @select(_.concat(PLOT_REDUX,'left_elements')) leftElementIDs$: Observable<number[]>;
  @select(_.concat(PLOT_REDUX,'right_elements')) rightElementIDs$: Observable<number[]>;
  @select(_.concat(PLOT_REDUX,'show_plot')) showPlot$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'show_date_selector')) showDateSelector$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'plot_time')) plotTimeRange$: Observable<IRange>
  @select(_.concat(PLOT_REDUX,'plot_data')) plotData$: Observable<IDataSet>;
  @select(_.concat(PLOT_REDUX,'adding_plot_data')) addingPlotData$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'nav_time')) navTimeRange$: Observable<IRange>
  @select(_.concat(PLOT_REDUX,'nav_data')) navData$: Observable<IDataSet>;
  @select(_.concat(PLOT_REDUX,'adding_nav_data')) addingNavData$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'nav_zoom_lock')) navZoomLock$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'data_cursor')) dataCursor$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'plot_y1')) plotY1$: Observable<IRange>;
  @select(_.concat(PLOT_REDUX,'plot_y2')) plotY2$: Observable<IRange>;
  @select(_.concat(PLOT_REDUX,'live_update')) liveUpdate$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'data_view_filter_text')) dataViewFilterText$: Observable<string>;
  @select(_.concat(PLOT_REDUX,'show_public_data_views')) showPublicDataViews$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'left_units')) leftElementUnits$: Observable<string>;
  @select(_.concat(PLOT_REDUX,'right_units')) rightElementUnits$: Observable<string>;
  @select(_.concat(PLOT_REDUX,'nilms_loaded')) nilmsLoaded$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'data_views_loaded')) dataViewsLoaded$: Observable<boolean>;
  @select(_.concat(PLOT_REDUX,'show_data_envelope')) showDataEnvelope$: Observable<boolean>;

  public leftElements$: Observable<IDbElement[]>
  public rightElements$: Observable<IDbElement[]>

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

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) {

    this.leftElements$ = this.elements$
      .combineLatest(this.leftElementIDs$)
      .map(([elements, ids]) => {
        return ids.map(id => elements[id]);
      })
      .distinctUntilChanged((x, y) => _.isEqual(x, y))
      .share()
      .startWith([])


    this.rightElements$ = this.elements$
      .combineLatest(this.rightElementIDs$)
      .map(([elements, ids]) => {
        return ids.map(id => elements[id])
      })
      .distinctUntilChanged((x, y) => _.isEqual(x, y))
      .share()
      .startWith([])


    this.plottedElements$ = this.leftElements$
      .combineLatest(this.rightElements$)
      .map(([left, right]) => left.concat(right))
      .distinctUntilChanged((x, y) => _.isEqual(x, y))
      .share()
      .startWith([])

    this.plottedStreams$ = this.plottedElements$
      .combineLatest(this.streams$)
      .map(([elements, streams]) => {
        return _.uniq(elements.map(e => e.db_stream_id))
          .map(id => streams[id])
          .filter(stream => stream !== undefined)
      })
      .share()


    this.isPlotEmpty$ = this.leftElementIDs$
      .combineLatest(this.rightElementIDs$)
      .map(([left, right]) => left.length == 0 && right.length == 0)
      .share()
      .startWith(true);

    this.isDataLoading$ = this.addingNavData$
      .combineLatest(this.addingPlotData$)
      .map(([nav, plot]) => nav && plot)
      .share()

    this.filteredDataViews$ = this.dataViews$
      .map(views => { //convert views to an array
        return Object.keys(views)
          .reduce((acc, id) => {
            acc.push(views[id]);
            return acc;
          }, [])
      })
      //mix in the filter observables
      .combineLatest(this.dataViewFilterText$, this.showPublicDataViews$)
      .map(([views, filterText, includePublic]) => {
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
      })
      .share()

    this.isIntervalDataDisplayed$ = this.plottedElements$
      .combineLatest(this.plotData$)
      .map(([elements, data]) => elements
        .map(e => data[e.id])
        .filter(data => data !== undefined))
      .map(dataset => {
        return dataset.reduce((isInterval, data) => {
          return isInterval || data.type == 'interval'
        }, false)
      })
      .share()

    this.isPlotDataValid$ = this.plottedElements$
      .combineLatest(this.plotData$)
      .map(([elements, data]) => elements
        .map(e => data[e.id])
        .filter(data => data !== undefined))
      .map(dataset => {
        return Object
          .keys(dataset)
          .reduce((isValid, id) => isValid && dataset[id].valid, true)
      })
      .share()
  }
}
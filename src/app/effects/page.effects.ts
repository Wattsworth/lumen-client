
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';

import { IAppState } from '../app.store';
import * as uiactions from '../explorer/store';
import * as actions from '../store/ui/actions';
import { createAction } from '@ngrx/store';

const BASE_URL = '/api';

@Injectable()
export class PageEffects {

  clearMessages$ = createEffect(()=>
  this.actions$.pipe(
    ofType(
      actions.setErrorMessages, 
      actions.setNoticeMessages, 
      actions.setWarningMessages),
    delay(5000), 
    map(()=>actions.clearMessages()),
    catchError(()=>EMPTY)));

  constructor(
    private actions$: Actions
  ) {}

  
  //TODO
  /*
  //When a UI action changes the plot, select the data explorer
  interfaceSelection = action$ => {
    return action$.pipe(
      ofType(DbElementActions.SET_COLOR,
              DbElementActions.SET_DISPLAY_NAME,
              PlotActions.PLOT_ELEMENT,
              PlotActions.AUTO_SCALE_AXIS,
              PlotActions.HIDE_ELEMENT,
              PlotActions.RESTORE_VIEW,
              PlotActions.SET_ELEMENT_AXIS,
              PlotActions.SET_LEFT_AXIS_SETTINGS,
              PlotActions.SET_NAV_RANGE_TO_PLOT_RANGE,
              PlotActions.SET_RIGHT_AXIS_SETTINGS,
              PlotActions.TOGGLE_DATA_CURSOR,
              PlotActions.TOGGLE_LIVE_UPDATE,
              PlotActions.TOGGLE_SHOW_DATA_ENVELOPE),
      mapTo({
              type: InterfaceActions.SELECT,
              payload: null
             }));
  }*/
}
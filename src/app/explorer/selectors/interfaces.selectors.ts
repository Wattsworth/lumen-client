
import {withLatestFrom} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {dataApps_, interfaces_UI_Ex_} from 'app/selectors';

export const INTERFACES_REDUX= ['ui','explorer','interfaces'];

import { IDataApp } from '../../store/data';

@Injectable()
export class InterfacesSelectors {

  displayedIds$ = this.store.pipe(select(createSelector(interfaces_UI_Ex_, state=>state.displayed)));
  selectedId$ = this.store.pipe(select(createSelector(interfaces_UI_Ex_, state=>state.selected)));
  apps$ = this.store.pipe(select(dataApps_));
  public displayed$: Observable<IDataApp[]>
  public noneDisplayed$: Observable<boolean>

  constructor(
    private store: Store
  ){

    this.displayed$ = this.displayedIds$.pipe(
      withLatestFrom(this.apps$),
      map(([ids, apps]) => ids.map(id => apps[id])),
      filter(module => module !== undefined));

    this.noneDisplayed$ = this.displayedIds$
      .pipe(map(ids => ids.length==0))
  }
}

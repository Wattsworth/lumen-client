import { Injectable } from '@angular/core';
import { createAction, Store } from '@ngrx/store';
import * as actions from './store/actions';

@Injectable()
export class AccountService {

  constructor(
    private store: Store,
  ) { }

  //set flag to indicate nilms have been loaded
  //
  public setNilmsLoaded(){
    this.store.dispatch(actions.setNilmsLoaded());
  }
  //set flag to indicate data views have been loaded
  //
  public setDataViewsLoaded(){
    this.store.dispatch(actions.setDataViewsLoaded());
  }
  //set flag to indicate user groups have been loaded
  //
  public setUserGroupsLoaded(){
    this.store.dispatch(actions.setUserGroupsLoaded());
  }

  public setLoggingIn(logging_in: boolean){
    this.store.dispatch(actions.setLoggingIn({logging_in}));
  }

}
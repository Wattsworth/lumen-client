import { Injectable } from '@angular/core';
import { Store, select, createSelector} from '@ngrx/store'

import { account_UI_, userGroups_, users_ } from 'app/selectors';

@Injectable()
export class AccountSelectors {

  nilmsLoaded$ = this.store.pipe(select(createSelector(account_UI_,state=>state.nilms_loaded)));
  dataViewsLoaded$ = this.store.pipe(select(createSelector(account_UI_,state=>state.data_views_loaded)));
  userGroupsLoaded$ = this.store.pipe(select(createSelector(account_UI_,state=>state.user_groups_loaded)));
  loggingIn$ = this.store.pipe(select(createSelector(account_UI_,state=>state.logging_in)));

  ownedGroups$ = this.store.pipe(select(createSelector(userGroups_,
     state => state.owner.map(id=>state.entities[id]))))
  memberGroups$ = this.store.pipe(select(createSelector(userGroups_, 
    state => state.member.map(id=>state.entities[id]))))

  users$ = this.store.pipe(select(users_));
  installation_token$= this.store.pipe(select(createSelector(users_, state=>state.new_installation_token)));
  can_add_installations$ = this.store.pipe(select(createSelector(users_, state=>state.installation_token_available)));


  constructor(
    private store:Store
  ) {}
}
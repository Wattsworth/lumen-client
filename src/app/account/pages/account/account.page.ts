import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select } from '@angular-redux/store';

import {
  UserGroupService,
  NilmService,
  DataViewService
} from '../../../services';

import {
  IUserStoreRecord,
  IUserGroupRecord,
  IUserGroupStore
} from '../../../store/data';


import { AccountSelectors } from '../../account.selectors';
import { AccountService } from '../../account.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.css']
})
export class AccountPageComponent implements OnInit {

  @select(['data', 'users']) users$: Observable<IUserStoreRecord>




  constructor(
    private nilmService: NilmService,
    private userGroupService: UserGroupService,
    public accountSelectors: AccountSelectors,
    public accountService: AccountService,
    public dataViewService: DataViewService
  ) {

  }

  ngOnInit() {
    
    //load the nilms
    this.nilmService.loadNilms()
      .subscribe(
      () => { },
      () => { },
      () => this.accountService.setNilmsLoaded());
    //load the data views
    this.dataViewService.loadDataViews()
      .subscribe(
      () => { },
      () => { },
      () => this.accountService.setDataViewsLoaded());
    //load the user groups
    this.userGroupService.loadUserGroups()
      .subscribe(
      () => { },
      () => { },
      () => this.accountService.setUserGroupsLoaded());
  }
  
  
}

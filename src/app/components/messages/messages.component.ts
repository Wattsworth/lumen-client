import { Component, OnInit } from '@angular/core';

import { IAppState } from '../../app.store';
import { IUI} from '../../store/ui';

import { Observable } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { global_UI_ } from 'app/selectors';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  
  public messages$ = this.store.pipe(select(global_UI_))

  constructor(
    private store: Store
  ) { }


}

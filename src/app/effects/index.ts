/*
import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';
import { Epic } from 'redux-observable';

import {PageEpics} from './page.epics';

import { 
  IPayloadAction 
} from '../store';
import {IAppState } from '../app.store';

@Injectable()
export class AppEpics {
  public root: Epic<IPayloadAction>;
 
  constructor(
    private pageEpics: PageEpics) {
    this.root = combineEpics(
      ...pageEpics.epics);
      //...sessionEpics.epics);
  }
}

export const EPIC_PROVIDERS = [PageEpics, AppEpics];
*/
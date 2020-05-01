import { Component } from '@angular/core';
import { createLogger } from 'redux-logger'
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { createEpicMiddleware } from 'redux-observable-es6-compat';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store';

import {AppEpics} from './epics';

import {
  SessionService
} from './services';

import {
  IAppState,
  rootReducer
} from './app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @select(['ui', 'global', 'page_header']) pageHeader$: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension,
    private epics: AppEpics,
    private sessionService: SessionService
  ) {


    //configure redux
    const epicMiddleware = createEpicMiddleware();

    const middleware = [
      createLogger({collapsed: true}),
      epicMiddleware
    ]

    

    ngRedux.configureStore(rootReducer,
      {},
      middleware,
      devTools.isEnabled() ?
        [devTools.enhancer()] : 
        []
    );
    epicMiddleware.run(this.epics.root);
    //todo: add interceptor to insert API URL
    /*
    //configure angular2-token
    tokenService.init({
     
    })*/

    sessionService.retrieveSiteSettings();
    //sessionService.validateToken();
  }

}

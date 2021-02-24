import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { appRoutes, JwtInterceptor } from './app.routes';
import { AppComponent } from './app.component';
import { SERVICE_PROVIDERS } from './services';
import { PageEffects } from './effects/page.effects';
import { AuthGuard } from './app.guards';
import { AlertModule } from 'ngx-bootstrap/alert';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ProgressbarModule } from 'ngx-bootstrap/progressbar';
import './rxjs-operators';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AccountModule } from './account/account.module';
import { InstallationModule } from './installation/installation.module';
import { ExplorerModule } from './explorer/explorer.module';

import {
  MessagesComponent,
  SessionComponent,
} from './components';


import {
  IAppState,
  uiReducer,
} from './app.store';
import {
  reducer
} from './store/data'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    SessionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    AccountModule,
    InstallationModule,
    ExplorerModule,
    appRoutes,
    StoreModule.forRoot({
      ui: uiReducer,
      data: reducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //retain last 25 states
      logOnly: false
    }),
    EffectsModule.forRoot([PageEffects])
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    SERVICE_PROVIDERS,
    //EPIC_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

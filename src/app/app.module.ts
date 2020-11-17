import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { appRoutes, JwtInterceptor } from './app.routes';
import { AppComponent } from './app.component';
import { SERVICE_PROVIDERS } from './services';
import { EPIC_PROVIDERS } from './epics';
import { AuthGuard } from './app.guards';
import { AlertModule } from 'ngx-bootstrap/alert';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { AccountModule } from './account/account.module';
import { InstallationModule } from './installation/installation.module';
import { ExplorerModule } from './explorer/explorer.module';

import {
  MessagesComponent,
  SessionComponent,
} from './components';

import './rxjs-operators';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



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
    NgReduxModule,
    RouterModule,
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    AccountModule,
    InstallationModule,
    ExplorerModule,
    appRoutes
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    SERVICE_PROVIDERS,
    EPIC_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

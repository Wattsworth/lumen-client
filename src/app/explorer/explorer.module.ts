import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faExclamationTriangle,
  faExclamationCircle,
  faHeartbeat,
  faLock,
  faCrosshairs,
  faDownload,
  faChartLine,
  faLifeRing,
  faDatabase,
  faSpinner,
  faSquare,
  faTimes,
  faCog,
  faCogs,
  faSearch,
  faSyncAlt,
  faCubes,
  faFolder,
  faFolderOpen,
  faChartArea,
  faExchangeAlt,
  faImage,
  faExternalLink
} from '@fortawesome/pro-solid-svg-icons'

import {
  TooltipModule,
  TabsModule,
  ModalModule,
  BsDropdownModule,
  DatepickerModule,
  TimepickerModule
} from 'ngx-bootstrap';
import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from '../shared/shared.module';
import { COMPONENTS } from './components';
import { ExplorerPageComponent } from './pages/explorer/explorer.page';
import { SERVICES } from './services';
import { SELECTORS } from './selectors';
import { TreeModule } from 'angular-tree-component';
import { DurationPipe } from './duration.pipe';

library.add(faLifeRing);
library.add(faSpinner);
library.add(faExclamationTriangle);
library.add(faExclamationCircle);
library.add(faHeartbeat);
library.add(faChartLine);
library.add(faSquare);
library.add(faTimes);
library.add(faDatabase);
library.add(faCog);
library.add(faCogs);
library.add(faSyncAlt);
library.add(faSearch);
library.add(faCubes);
library.add(faFolder);
library.add(faFolderOpen);
library.add(faChartArea);
library.add(faLock);
library.add(faCrosshairs);
library.add(faExchangeAlt);
library.add(faImage);
library.add(faDownload);
library.add(faExternalLink);

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    RouterModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    FontAwesomeModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [
    COMPONENTS,
    ExplorerPageComponent,
    DurationPipe,
  ],
  providers: [
    SERVICES,
    SELECTORS,
    DatePipe
  ],
  exports: [
    ExplorerPageComponent
  ]
})
export class ExplorerModule { }

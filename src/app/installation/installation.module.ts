import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

import { 
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { AlertModule } from 'ngx-bootstrap/alert';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
 import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
 import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
 import {
   faSpinner,
   faLifeRing,
   faSync,
   faExclamationTriangle,
   faUserPlus,
   faUser,
   faUsers,
   faFolder,
   faFolderOpen,
   faExternalLinkAlt,
   faDatabase
 } from '@fortawesome/free-solid-svg-icons'

import { COMPONENTS } from './components';
import { TABS } from './tabs';
import { PIPES } from './pipes';
import { InstallationPageComponent } from './pages';
import { InstallationService } from './installation.service'
import { InstallationSelectors } from './installation.selectors';
import { SharedModule } from '../shared/shared.module';
import { EditModuleComponent } from './components/edit-module/edit-module.component';
import { EditEventstreamComponent } from './components/edit-eventstream/edit-eventstream.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TreeModule.forRoot(),
    NgSelectModule,
    NgOptionHighlightModule,
    SharedModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    COMPONENTS,
    TABS,
    PIPES,
    InstallationPageComponent,
    EditModuleComponent,
    EditEventstreamComponent
  ],
  providers: [
    InstallationService,
    InstallationSelectors
  ],
  exports: [
    InstallationPageComponent
  ]
})
export class InstallationModule { 
  constructor(library: FaIconLibrary){
    library.addIcons(faSpinner,
      faLifeRing,
      faSync,
      faExclamationTriangle,
      faUserPlus,
      faUser,
      faUsers,
      faFolder,
      faFolderOpen,
      faExternalLinkAlt,
      faDatabase)
  }
}

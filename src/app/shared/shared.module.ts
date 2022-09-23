import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
} from '@angular/forms';

import {COMPONENTS} from './components';
import {PIPES} from './pipes';
import { DIRECTIVES } from './directives';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    COMPONENTS,
    PIPES,
    DIRECTIVES
  ],
  exports: [
    COMPONENTS,
    PIPES,
    DIRECTIVES
  ]
})
export class SharedModule { }

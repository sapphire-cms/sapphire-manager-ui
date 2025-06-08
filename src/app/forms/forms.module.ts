import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleFieldComponent} from './simple-field/simple-field.component';
import {ListFieldComponent} from './list-field/list-field.component';
import {ListItemComponent} from './list-item/list-item.component';
import {ContentFormComponent} from './content-form/content-form.component';
import {DocIdInputComponent} from './doc-id-input/doc-id-input.component';
import {DocPathInputComponent} from './doc-path-input/doc-path-input.component';

@NgModule({
  declarations: [
    SimpleFieldComponent,
    ListFieldComponent,
    ListItemComponent,
    ContentFormComponent,
    DocIdInputComponent,
    DocPathInputComponent,
  ],
  exports: [
    ContentFormComponent,
    DocIdInputComponent,
    DocPathInputComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class FormsModule { }

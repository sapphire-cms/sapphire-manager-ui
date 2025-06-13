import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleFieldComponent} from './simple-field/simple-field.component';
import {SimpleListFieldComponent} from './simple-list-field/simple-list-field.component';
import {ListItemComponent} from './list-item/list-item.component';
import {DocumentFormComponent} from './document-form/document-form.component';
import {DocIdInputComponent} from './doc-id-input/doc-id-input.component';
import {DocPathInputComponent} from './doc-path-input/doc-path-input.component';
import {SimpleInputComponent} from './simple-input/simple-input.component';
import {GroupFieldComponent} from './group-field/group-field.component';
import {GroupListFieldComponent} from './group-list-field/group-list-field.component';

@NgModule({
  declarations: [
    DocIdInputComponent,
    DocPathInputComponent,
    SimpleInputComponent,
    SimpleFieldComponent,
    GroupFieldComponent,
    SimpleListFieldComponent,
    GroupListFieldComponent,
    ListItemComponent,
    DocumentFormComponent,
  ],
  exports: [
    DocumentFormComponent,
    DocIdInputComponent,
    DocPathInputComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class FormsModule { }

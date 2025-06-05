import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleFieldComponent} from './simple-field/simple-field.component';
import {ListFieldComponent} from './list-field/list-field.component';
import {ListItemComponent} from './list-item/list-item.component';
import {DocumentFormComponent} from './document-form/document-form.component';

@NgModule({
  declarations: [
    SimpleFieldComponent,
    ListFieldComponent,
    ListItemComponent,
    DocumentFormComponent,
  ],
  exports: [
    DocumentFormComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class FormsModule { }

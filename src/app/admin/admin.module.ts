import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminService} from './admin.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AdminService,
  ]
})
export class AdminModule { }

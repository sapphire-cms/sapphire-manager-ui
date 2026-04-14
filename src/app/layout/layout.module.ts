import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {SharedModule} from '../shared/shared.module';
import {RouterLink} from '@angular/router';
import {LoaderComponent} from './loader/loader.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LoaderComponent,
  ],
  exports: [
    NavbarComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterLink,
  ]
})
export class LayoutModule { }

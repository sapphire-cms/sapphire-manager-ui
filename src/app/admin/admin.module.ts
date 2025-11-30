import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminService} from './admin.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    AdminService,
  ]
})
export class AdminModule { }

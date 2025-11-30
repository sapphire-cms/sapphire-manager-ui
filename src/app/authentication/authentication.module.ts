import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminModule} from '../admin/admin.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthenticationInterceptor} from './authentication.interceptor';
import {AuthenticationPageComponent} from './authentication-page/authentication-page.component';
import {AuthenticationGuard} from './authentication.guard';
import {AuthenticationFormComponent} from './authentication-form/authentication-form.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AuthenticationFormComponent,
    AuthenticationPageComponent,
  ],
  providers: [
    AuthenticationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
})
export class AuthenticationModule {}

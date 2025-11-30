import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {AuthenticationModule} from './authentication/authentication.module';
import {AuthenticationPageComponent} from './authentication/authentication-page/authentication-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/management',
  },
  {
    path: 'management',
    loadChildren: () => import('./management/management.module').then(m => m.ManagementModule),
    canActivate: [ AuthenticationGuard ],
  },
  {
    path: 'login',
    component: AuthenticationPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
    }),
    AuthenticationModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

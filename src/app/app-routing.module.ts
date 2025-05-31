import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/management',
  },
  {
    path: 'management',
    loadChildren: () => import('./management/management.module').then(m => m.ManagementModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

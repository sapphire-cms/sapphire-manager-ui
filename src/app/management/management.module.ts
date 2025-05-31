import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreList} from './store-list/store-list.component';
import {ManagementService} from './management.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ManagementComponent} from './management/management.component';
import {RouterModule} from '@angular/router';
import {StoreDetailsComponent} from './store-details/store-details.component';
import {ContentSchemaResolver} from './content-schema.resolver';
import {StoreDocumentsResolver} from './store-documents.resolver';
import {DocumentEditComponent} from './document-edit/document-edit.component';
import {DocumentResolver} from './document.resolver';
import {routes} from './management-routes';

@NgModule({
  declarations: [
    StoreList,
    ManagementComponent,
    StoreDetailsComponent,
    DocumentEditComponent,
  ],
  exports: [
    StoreList
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ManagementService,
    ContentSchemaResolver,
    StoreDocumentsResolver,
    DocumentResolver,
  ]
})
export class ManagementModule { }

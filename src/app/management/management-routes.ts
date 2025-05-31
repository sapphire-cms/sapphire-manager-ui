import {Routes} from '@angular/router';
import {ManagementComponent} from './management/management.component';
import {StoreDetailsPlaceholderComponent} from './store-details-placeholder/store-details-placeholder.component';
import {StoreDetailsComponent} from './store-details/store-details.component';
import {CONTENT_SCHEMA_KEY, ContentSchemaResolver} from './content-schema.resolver';
import {STORE_DOCUMENTS_KEY, StoreDocumentsResolver} from './store-documents.resolver';
import {DocumentEditComponent} from './document-edit/document-edit.component';
import {DOCUMENT_KEY, DocumentResolver} from './document.resolver';

export const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: StoreDetailsPlaceholderComponent,
      },
      {
        path: 'stores/:store',
        resolve: {
          [CONTENT_SCHEMA_KEY]: ContentSchemaResolver,
          [STORE_DOCUMENTS_KEY]: StoreDocumentsResolver,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: StoreDetailsComponent,
          },
          {
            path: 'docs',
            children: [
              {
                path: '**',
                component: DocumentEditComponent,
                resolve: {
                  [DOCUMENT_KEY]: DocumentResolver,
                },
              }
            ],
          }
        ],
      },
    ],
  },
];

import {Routes} from '@angular/router';
import {ManagementComponent} from './management/management.component';
import {StoreDetailsPlaceholderComponent} from './store-details-placeholder/store-details-placeholder.component';
import {StoreDetailsComponent} from './store-details/store-details.component';
import {CONTENT_SCHEMA_KEY, ContentSchemaResolver} from './content-schema.resolver';
import {DocumentEditComponent} from './document-edit/document-edit.component';
import {DocumentCreateComponent} from './document-create/document-create.component';
import {docRefResolver, DOCUMENT_REFERENCE} from './doc-ref.resolver';

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
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: StoreDetailsComponent,
          },
          {
            path: 'actions/create',
            component: DocumentCreateComponent,
          },
          {
            path: 'docs',
            children: [
              {
                path: '**',
                component: DocumentEditComponent,
                resolve: {
                  [DOCUMENT_REFERENCE]: docRefResolver,
                },
              }
            ],
          }
        ],
      },
    ],
  },
];

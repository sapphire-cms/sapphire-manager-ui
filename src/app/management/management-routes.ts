import {Routes} from '@angular/router';
import {ManagementComponent} from './management/management.component';
import {StoreDetailsPlaceholderComponent} from './store-details-placeholder/store-details-placeholder.component';
import {StoreDetailsComponent} from './store-details/store-details.component';
import {CONTENT_SCHEMA_KEY, ContentSchemaResolver} from './content-schema.resolver';
import {DocumentEditComponent} from './document-edit/document-edit.component';
import {DocumentCreateComponent} from './document-create/document-create.component';
import {DOCUMENT_KEY, DocumentResolver} from './document.resolver';
import {MediaManagerComponent} from './media-manager/media-manager.component';
import {MediaUploadComponent} from './media-upload/media-upload.component';

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
                  [DOCUMENT_KEY]: DocumentResolver,
                },
              }
            ],
          }
        ],
      },
      {
        path: 'media',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'browse',
          },
          {
            path: 'browse',
            children: [
              {
                path: '',
                component: MediaManagerComponent,
              },
              {
                path: '**',
                component: MediaManagerComponent,
              },
            ],
          },
          {
            path: 'upload',
            children: [
              {
                path: '',
                component: MediaUploadComponent,
              },
              {
                path: '**',
                component: MediaUploadComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

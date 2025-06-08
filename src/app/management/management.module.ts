import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreList} from './store-list/store-list.component';
import {ManagementService} from './management.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ManagementComponent} from './management/management.component';
import {RouterModule} from '@angular/router';
import {StoreDetailsComponent} from './store-details/store-details.component';
import {ContentSchemaResolver} from './content-schema.resolver';
import {DocumentEditComponent} from './document-edit/document-edit.component';
import {DocumentResolver} from './document.resolver';
import {routes} from './management-routes';
import {FormsModule} from '../forms/forms.module';
import {DefaultInputsModule} from '../default-inputs/default-inputs.module';
import {DocumentCreateComponent} from './document-create/document-create.component';
import {ContentTypeIconComponent} from './content-type-icon/content-type-icon.component';
import {DocPathNavbarComponent} from './doc-path-navbar/doc-path-navbar.component';
import {ReferenceInputComponent} from './reference-input/reference-input.component';
import {InputsRegistryService} from '../inputs-base/inputs-registry.service';
import {TextInputComponent} from '../default-inputs/text-input/text-input.component';
import {CheckInputComponent} from '../default-inputs/check-input/check-input.component';
import {NumberInputComponent} from '../default-inputs/number-input/number-input.component';
import {TagInputComponent} from '../default-inputs/tag-input/tag-input.component';
import {DocumentPickerComponent} from './document-picker/document-picker.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DefaultInputsModule,  // TODO: think where to place it
  ],
  declarations: [
    ContentTypeIconComponent,
    DocPathNavbarComponent,
    StoreList,
    ManagementComponent,
    StoreDetailsComponent,
    DocumentCreateComponent,
    DocumentEditComponent,
    DocumentPickerComponent,
    ReferenceInputComponent,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ManagementService,
    ContentSchemaResolver,
    DocumentResolver,
  ]
})
export class ManagementModule {
  constructor(inputsRegistry: InputsRegistryService) {
    inputsRegistry.register('reference', ReferenceInputComponent);
  }
}

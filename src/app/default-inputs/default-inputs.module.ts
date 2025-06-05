import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextInputComponent} from './text-input/text-input.component';
import {InputsRegistryService} from '../inputs-base/inputs-registry.service';
import {CheckInputComponent} from './check-input/check-input.component';
import {NumberInputComponent} from './number-input/number-input.component';
import {TagInputComponent} from './tag-input/tag-input.component';

@NgModule({
  declarations: [
    TextInputComponent,
    CheckInputComponent,
    NumberInputComponent,
    TagInputComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class DefaultInputsModule {
  constructor(inputsRegistry: InputsRegistryService) {
    inputsRegistry.register('text', TextInputComponent);
    inputsRegistry.register('check', CheckInputComponent);
    inputsRegistry.register('number', NumberInputComponent);
    inputsRegistry.register('tag', TagInputComponent);
  }
}

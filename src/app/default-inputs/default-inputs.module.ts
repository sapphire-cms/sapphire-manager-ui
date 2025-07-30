import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextInputComponent} from './text-input/text-input.component';
import {InputsRegistryService} from '../inputs-base/inputs-registry.service';
import {CheckInputComponent} from './check-input/check-input.component';
import {NumberInputComponent} from './number-input/number-input.component';
import {TagInputComponent} from './tag-input/tag-input.component';
import {RichTextInputComponent} from './rich-text-input/rich-text-input.component';
import {RawComponent} from './rich-text-input/raw/raw.component';
import {TiptapEditorDirective} from 'ngx-tiptap';
import {FormsModule} from '@angular/forms';
import {WysiwygComponent} from './rich-text-input/wysiwyg/wysiwyg.component';
import {MonacoEditorModule} from 'ngx-monaco-editor-v2';

@NgModule({
  declarations: [
    TextInputComponent,
    CheckInputComponent,
    NumberInputComponent,
    TagInputComponent,
    RawComponent,
    WysiwygComponent,
    RichTextInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    TiptapEditorDirective,
  ]
})
export class DefaultInputsModule {
  constructor(inputsRegistry: InputsRegistryService) {
    inputsRegistry.register('text', TextInputComponent);
    inputsRegistry.register('check', CheckInputComponent);
    inputsRegistry.register('number', NumberInputComponent);
    inputsRegistry.register('tag', TagInputComponent);
    inputsRegistry.register('rich-text', RichTextInputComponent);
  }
}

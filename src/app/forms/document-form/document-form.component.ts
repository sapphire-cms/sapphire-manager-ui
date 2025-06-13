import {ChangeDetectionStrategy, Component, effect, EventEmitter, input, Input, Output} from '@angular/core';
import {ContentSchema, ValidationResult} from '@sapphire-cms/core';
import {FullDocument, PrimitiveList, PrimitiveValue} from '../forms.types';

@Component({
  selector: 'scms-document-form',
  standalone: false,
  templateUrl: './document-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFormComponent {

  @Input()
  public contentSchema!: ContentSchema;

  public document = input<FullDocument>();

  @Output()
  public readonly documentChange = new EventEmitter<FullDocument>();

  protected updatedDocument?: FullDocument;

  constructor() {
    effect(() => {
      this.updatedDocument = this.document()?.clone();
    });
  }

  protected getPrimitiveValue(fieldName: string): PrimitiveValue | undefined {
    return this.document()!.content[fieldName] as PrimitiveValue | undefined;
  }

  protected getPrimitiveList(fieldName: string): PrimitiveList {
    return (this.document()!.content[fieldName] || []) as PrimitiveList;
  }

  protected getGroupDoc(fieldName: string): FullDocument | undefined {
    return this.document()!.content[fieldName] as FullDocument | undefined;
  }

  protected getGroupDocList(fieldName: string): FullDocument[] {
    return (this.document()!.content[fieldName] || []) as FullDocument[];
  }

  protected getValidationResults(fieldName: string): ValidationResult[] {
    return this.document()!.validation
      ? this.document()!.validation!.fields[fieldName]
      : [];
  }

  protected onFieldValueChange(
    fieldName: string,
    newValue:
      | PrimitiveValue
      | PrimitiveList
      | FullDocument
      | FullDocument[]
      | undefined) {
    this.updatedDocument!.content[fieldName] = newValue;
    this.documentChange.emit(this.updatedDocument);
  }
}

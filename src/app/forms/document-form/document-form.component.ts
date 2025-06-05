import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ContentSchema, ContentValidationResult, Document, ValidationResult} from '@sapphire-cms/core';

@Component({
  selector: 'scms-document-form',
  standalone: false,
  templateUrl: './document-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFormComponent {

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public document!: Document;

  @Input()
  public validationResult?: ContentValidationResult;

  @Output()
  public readonly documentChange = new EventEmitter<Document>();

  protected getSimpleFieldValue(fieldName: string): string | number | boolean | undefined {
    return this.document.content[fieldName] as string | number | boolean | undefined;
  }

  protected getListFieldValue(fieldName: string): (string | number | boolean)[] {
    return this.document.content[fieldName] as (string | number | boolean)[];
  }

  protected getValidationResults(fieldName: string): ValidationResult[] {
    return this.validationResult
      ? this.validationResult.fields[fieldName]
      : [];
  }

  protected onFieldValueChange(fieldName: string, newValue: any) {
    this.document.content[fieldName] = newValue;
    this.documentChange.emit(this.document);
  }
}

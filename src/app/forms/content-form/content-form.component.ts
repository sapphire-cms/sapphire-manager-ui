import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ContentSchema, ContentValidationResult, DocumentContent, ValidationResult} from '@sapphire-cms/core';

@Component({
  selector: 'scms-content-form',
  standalone: false,
  templateUrl: './content-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFormComponent {

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public content: DocumentContent = {};

  @Input()
  public validationResult?: ContentValidationResult;

  @Output()
  public readonly contentChange = new EventEmitter<DocumentContent>();

  protected getSimpleFieldValue(fieldName: string): string | number | boolean | undefined {
    return this.content[fieldName] as string | number | boolean | undefined;
  }

  protected getListFieldValue(fieldName: string): (string | number | boolean)[] {
    return this.content[fieldName] as (string | number | boolean)[];
  }

  protected getValidationResults(fieldName: string): ValidationResult[] {
    return this.validationResult
      ? this.validationResult.fields[fieldName]
      : [];
  }

  protected onFieldValueChange(fieldName: string, newValue: any) {
    this.content[fieldName] = newValue;
    this.contentChange.emit(this.content);
  }
}

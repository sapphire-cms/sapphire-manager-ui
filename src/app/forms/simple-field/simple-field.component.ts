import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldSchema, ValidationResult} from '@sapphire-cms/core';
import {PrimitiveValue} from '../forms.types';

@Component({
  selector: 'scms-simple-field',
  standalone: false,
  templateUrl: './simple-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFieldComponent {

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public fieldValue?: PrimitiveValue;

  @Input()
  public validationResult?: ValidationResult;

  @Output()
  public readonly fieldValueChange = new EventEmitter<PrimitiveValue | undefined>();

  protected get invalid(): boolean {
    return !!this.validationResult && !this.validationResult.isValid;
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldSchema, ValidationResult} from '@sapphire-cms/core';

@Component({
  selector: 'scms-list-field',
  standalone: false,
  templateUrl: './list-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFieldComponent<T extends (string | number | boolean | undefined)[]> {

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public fieldValue!: T;

  @Input()
  public validationResults?: ValidationResult[];

  @Output()
  public readonly fieldValueChange = new EventEmitter<T>();

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  protected onValueChange(index: number, newValue: string | number | boolean | undefined) {
    this.fieldValue[index] = newValue;

    this.fieldValueChange.emit(this.fieldValue);
    this.cdr.markForCheck();
  }

  protected moveUp(index: number) {
    const arr = this.fieldValue as Array<any>;
    const copy = arr[index - 1];
    arr[index - 1] = arr[index];
    arr[index] = copy;

    this.fieldValueChange.emit(this.fieldValue);
    this.cdr.markForCheck();
  }

  protected moveDown(index: number) {
    const arr = this.fieldValue as Array<any>;
    const copy = arr[index + 1];
    arr[index + 1] = arr[index];
    arr[index] = copy;

    this.fieldValueChange.emit(this.fieldValue);
    this.cdr.markForCheck();
  }

  protected delete(index: number) {
    const arr = this.fieldValue as Array<any>;
    arr.splice(index, 1);

    this.fieldValueChange.emit(this.fieldValue);
    this.cdr.markForCheck();
  }

  protected addItem() {
    const arr = this.fieldValue as Array<any>;
    arr.push(undefined);

    this.fieldValueChange.emit(this.fieldValue);
    this.cdr.markForCheck();
  }
}

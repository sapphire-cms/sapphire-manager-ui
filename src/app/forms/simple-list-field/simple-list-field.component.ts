import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  input,
  Input,
  Output
} from '@angular/core';
import {FieldSchema, ValidationResult} from '@sapphire-cms/core';
import {EditableList, emptySimpleValue, PrimitiveList, PrimitiveValue} from '../forms.types';

@Component({
  selector: 'scms-simple-list-field',
  standalone: false,
  templateUrl: './simple-list-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleListFieldComponent {

  @Input()
  public fieldSchema!: FieldSchema;

  public readonly fieldValue = input<PrimitiveList>([]);

  @Input()
  public validationResults?: ValidationResult[];

  @Output()
  public readonly fieldValueChange = new EventEmitter<PrimitiveList>();

  protected editableList: EditableList<PrimitiveValue | undefined> = new EditableList([]);

  constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      this.editableList = new EditableList<PrimitiveValue | undefined>(this.fieldValue());
    });
  }

  protected onValueChange(index: number, newValue: PrimitiveValue | undefined) {
    this.editableList.set(index, newValue);
    this.fieldValueChange.emit(this.editableList.toArray());
  }

  protected moveUp(index: number) {
    this.editableList.moveUp(index);
    this.fieldValueChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected moveDown(index: number) {
    this.editableList.moveDown(index);
    this.fieldValueChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected delete(index: number) {
    this.editableList.delete(index);
    this.fieldValueChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected addItem() {
    this.editableList.add(emptySimpleValue(this.fieldSchema.type));
    this.fieldValueChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }
}

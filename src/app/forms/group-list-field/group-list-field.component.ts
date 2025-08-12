import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  input,
  Input, OnInit,
  Output
} from '@angular/core';
import {
  ContentSchema,
  createHiddenCollectionSchema,
  FieldSchema,
  ValidationResult
} from '@sapphire-cms/core';
import {EditableList, FullDocument} from '../forms.types';

@Component({
  selector: 'scms-group-list-field',
  standalone: false,
  templateUrl: './group-list-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListFieldComponent implements OnInit {

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public fieldSchema!: FieldSchema;

  public readonly groupDocs = input<FullDocument[]>([]);

  @Input()
  public validationResults?: ValidationResult[];

  @Output()
  public readonly groupDocsChange = new EventEmitter<FullDocument[]>();

  protected hiddenCollectionSchema!: ContentSchema;
  protected editableList: EditableList<FullDocument> = new EditableList([]);

  constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      this.editableList = new EditableList<FullDocument>(this.groupDocs());
    });
  }

  ngOnInit(): void {
    this.hiddenCollectionSchema = createHiddenCollectionSchema(this.contentSchema, this.fieldSchema);
  }

  protected onValueChange(index: number, newValue: FullDocument) {
    this.editableList.set(index, newValue);
    this.groupDocsChange.emit(this.editableList.toArray());
  }

  protected moveUp(index: number) {
    this.editableList.moveUp(index);
    this.groupDocsChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected moveDown(index: number) {
    this.editableList.moveDown(index);
    this.groupDocsChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected delete(index: number) {
    this.editableList.delete(index);
    this.groupDocsChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }

  protected addItem() {
    this.editableList.add(FullDocument.createEmpty(this.hiddenCollectionSchema));
    this.groupDocsChange.emit(this.editableList.toArray());
    this.cdr.markForCheck();
  }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContentSchema, createHiddenCollectionSchema, FieldSchema} from '@sapphire-cms/core';
import {FullDocument} from '../forms.types';

@Component({
  selector: 'scms-group-field',
  standalone: false,
  templateUrl: './group-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFieldComponent implements OnInit {

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public groupDoc?: FullDocument;

  @Output()
  public readonly groupDocChange = new EventEmitter<FullDocument>();

  protected hiddenCollectionSchema!: ContentSchema;

  ngOnInit(): void {
    this.hiddenCollectionSchema = createHiddenCollectionSchema(this.contentSchema, this.fieldSchema);

    if (this.fieldSchema.required) {
      this.createEmptyDoc();
    }
  }

  protected createEmptyDoc() {
    this.groupDoc = FullDocument.createEmpty(this.hiddenCollectionSchema);
    this.groupDocChange.emit(this.groupDoc);
  }

  protected delete() {
    this.groupDoc = undefined;
    this.groupDocChange.emit(this.groupDoc);
  }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ContentSchema, ContentType, DocumentInfo, DocumentReference} from '@sapphire-cms/core';

@Component({
  selector: 'scms-document-picker',
  standalone: false,
  templateUrl: './document-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPickerComponent {
  protected readonly ContentType = ContentType;

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public documents: DocumentInfo[] = [];

  @Input()
  public shown = false;

  @Output()
  public readonly docRef = new EventEmitter<DocumentReference>();

  @Output()
  public readonly close = new EventEmitter<void>();

  protected onSelect(doc: DocumentInfo, variant: string) {
    const docRef = new DocumentReference(doc.store, doc.path, doc.docId, variant);
    this.docRef.emit(docRef);
  }
}

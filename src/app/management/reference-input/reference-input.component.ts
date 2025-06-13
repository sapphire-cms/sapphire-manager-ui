import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';
import {ManagementClient} from '../management-client.service';
import {ContentSchema, ContentType, DocumentInfo, DocumentReference} from '@sapphire-cms/core';

@Component({
  selector: 'scms-reference-input',
  standalone: false,
  templateUrl: './reference-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceInputComponent extends AbstractInput<string> {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;
  protected documents: DocumentInfo[] = [];
  protected pickedShown = false;

  constructor(private readonly managementService: ManagementClient,
              private readonly cdr: ChangeDetectorRef) {
    super();
  }

  protected showDocumentPicker() {
    this.managementService.getContentSchema(this.params.store)
      .subscribe(contentSchema => {
        this.contentSchema = contentSchema;
        this.cdr.markForCheck();
      });

    this.managementService.listDocuments(this.params.store)
      .subscribe(documents => {
        this.documents = documents;
        this.pickedShown = true;
        this.cdr.markForCheck();
      });
  }

  protected onSelect(docRef: DocumentReference) {
    this.value = docRef.toString();
    this.valueChange.emit(docRef.toString());
    this.pickedShown = false;
    this.cdr.markForCheck();
  }

  protected clear() {
    this.value = undefined;
    this.valueChange.emit(undefined);
    this.cdr.markForCheck();
  }
}

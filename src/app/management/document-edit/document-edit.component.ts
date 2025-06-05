import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentSchema, ContentType, ContentValidationResult, Document, ValidationResult} from '@sapphire-cms/core';
import {map, Subject, takeUntil} from 'rxjs';
import {DOCUMENT_KEY} from '../document.resolver';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import deepEqual from 'fast-deep-equal/es6';
import {deepClone} from '../../../utils/deep-clone';
import {ManagementService} from '../management.service';

@Component({
  selector: 'scms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditComponent implements OnDestroy {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;
  protected originalDocument!: Document;
  protected changedDocument!: Document;
  protected validationResult?: ContentValidationResult;

  private readonly destroy$ = new Subject();

  constructor(private readonly managementService: ManagementService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(map(data => data[DOCUMENT_KEY]), takeUntil(this.destroy$))
      .subscribe(document => {
        this.contentSchema = this.activatedRoute.parent?.parent?.snapshot.data[CONTENT_SCHEMA_KEY];
        this.originalDocument = deepClone(document);
        this.changedDocument = deepClone(document);
        this.cdr.markForCheck();
      });
  }

  protected onDocumentChange(newDocument: Document) {
    this.changedDocument = newDocument;
    this.cdr.markForCheck();
  }

  protected get documentChanged(): boolean {
    return !deepEqual(this.originalDocument, this.changedDocument);
  }

  protected saveChanges() {
    this.managementService.validateDocumentContent(this.contentSchema.name, this.changedDocument.content)
      .subscribe(validationResult => {
        console.log(validationResult);

        this.validationResult = validationResult;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

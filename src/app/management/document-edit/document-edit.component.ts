import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  ContentSchema,
  ContentType,
  ContentValidationResult,
  Document,
  DocumentReference, InvalidDocumentError,
} from '@sapphire-cms/core';
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
  protected unexpectedServerError?: string;

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

    if (!this.documentChanged) {
      this.validationResult = undefined;
    }

    this.cdr.markForCheck();
  }

  protected get documentChanged(): boolean {
    return !deepEqual(this.originalDocument, this.changedDocument);
  }

  protected saveChanges() {
    const docRef = new DocumentReference(
      this.changedDocument.store,
      this.changedDocument.path,
      this.changedDocument.id,
      this.changedDocument.variant,
    );

    this.managementService.putDocument(docRef, this.changedDocument.content).subscribe({
      next: (document) => {
        this.originalDocument = deepClone(document);
        this.changedDocument = deepClone(document);
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 400) {
          this.validationResult = (err.error as InvalidDocumentError).validationResult;
        } else {
          this.unexpectedServerError = err.error;
        }

        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

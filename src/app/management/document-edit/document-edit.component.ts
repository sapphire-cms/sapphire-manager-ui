import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentSchema,} from '@sapphire-cms/core';
import {Subject, takeUntil} from 'rxjs';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import deepEqual from 'fast-deep-equal/es6';
import {ManagementService} from '../management.service';
import {FullDocument} from '../../forms/forms.types';
import {ManagementClient} from '../management-client.service';
import {DOCUMENT_KEY} from '../document.resolver';

@Component({
  selector: 'scms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditComponent implements OnDestroy {
  // protected docRef!: DocumentReference;
  protected contentSchema!: ContentSchema;
  protected originalDocument!: FullDocument;
  protected changedDocument!: FullDocument;
  protected unexpectedServerError?: string;

  private readonly destroy$ = new Subject();

  constructor(private readonly managementClient: ManagementClient,
              private readonly managementService: ManagementService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // this.docRef = data[DOCUMENT_REFERENCE];
        this.contentSchema = data[CONTENT_SCHEMA_KEY];
        this.originalDocument = (data[DOCUMENT_KEY] as FullDocument).clone();
        this.changedDocument = this.originalDocument.clone();
        // this.loadDocument();
      });
  }

  protected onDocumentChange(updatedDocument: FullDocument) {
    this.changedDocument = updatedDocument;
  }

  protected get documentChanged(): boolean {
    return !deepEqual(this.originalDocument, this.changedDocument);
  }

  protected saveChanges() {
    this.managementService.saveDocument(this.changedDocument, this.contentSchema).match(
      document => {
        this.originalDocument = document.clone();
        this.changedDocument = document.clone();
        this.cdr.markForCheck();
      },
      err => {
        console.error(err);
        this.unexpectedServerError = err.message;
        this.cdr.markForCheck();
      },
      defect => {
        console.error(defect);
        this.unexpectedServerError = String(defect);
        this.cdr.markForCheck();
      },
    );
  }

  protected publish() {
    this.managementClient.publishDocument(this.originalDocument.ref).subscribe(() => {
      this.loadDocument();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private loadDocument() {
    this.managementService.loadDocument(this.originalDocument.ref, this.contentSchema).match(
      document => {
        this.originalDocument = document.clone();
        this.changedDocument = document.clone();
        this.cdr.markForCheck();
      },
      err => {
        this.unexpectedServerError = err.message;
        this.cdr.markForCheck();
      },
      defect => {
        this.unexpectedServerError = String(defect);
        this.cdr.markForCheck();
      },
    );
  }
}

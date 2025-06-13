import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentSchema,} from '@sapphire-cms/core';
import {map, Subject, takeUntil} from 'rxjs';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import deepEqual from 'fast-deep-equal/es6';
import {DOCUMENT_REFERENCE} from '../doc-ref.resolver';
import {ManagementService} from '../management.service';
import {FullDocument} from '../../forms/forms.types';

@Component({
  selector: 'scms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditComponent implements OnDestroy {
  protected contentSchema!: ContentSchema;
  protected originalDocument!: FullDocument;
  protected changedDocument!: FullDocument;
  protected unexpectedServerError?: string;

  private readonly destroy$ = new Subject();

  constructor(private readonly managementService: ManagementService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(map(data => data[DOCUMENT_REFERENCE]), takeUntil(this.destroy$))
      .subscribe(docRef => {
        this.contentSchema = this.activatedRoute.parent?.parent?.snapshot.data[CONTENT_SCHEMA_KEY];

        this.managementService.loadDocument(docRef, this.contentSchema).match(
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

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

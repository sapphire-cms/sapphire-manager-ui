import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {
  ContentSchema, ContentType,
  ContentValidationResult,
  DocumentContent,
  DocumentReference, InvalidDocumentError,
} from '@sapphire-cms/core';
import {map, Subject, takeUntil} from 'rxjs';
import {ManagementService} from '../management.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';

@Component({
  selector: 'scms-document-create',
  standalone: false,
  templateUrl: './document-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCreateComponent implements OnDestroy {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;

  protected docId?: string;
  protected docIdValid = true;

  protected path: string[] = [];
  protected pathValid = true;

  protected content?: DocumentContent;
  protected validationResult?: ContentValidationResult;

  protected unexpectedServerError?: string;

  private readonly destroy$ = new Subject();

  constructor(private readonly managementService: ManagementService,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.parent?.data
      .pipe(map(data => data[CONTENT_SCHEMA_KEY]), takeUntil(this.destroy$))
      .subscribe((contentSchema: ContentSchema) => {
        this.contentSchema = contentSchema;
        this.cdr.markForCheck();
      });
  }

  protected get readyToSave(): boolean {
    return this.docIdValid && this.pathValid && !!this.content;
  }

  protected saveDocument() {
    const docRef = new DocumentReference(
      this.contentSchema.name,
      this.path,
      this.docId,
      // this.changedDocument.variant,  // TODO: provide variant
    );

    this.managementService.putDocument(docRef, this.content!).subscribe({
      next: (document) => {
        const redirectPath = [ '/management', 'stores', document.store, 'docs', ...document.path, document.id ].filter(token => token);
        this.router.navigate(redirectPath);
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

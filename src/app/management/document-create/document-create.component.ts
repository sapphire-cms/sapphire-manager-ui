import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ContentSchema, ContentType,} from '@sapphire-cms/core';
import {map, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import {FullDocument} from '../../forms/forms.types';
import {ManagementService} from '../management.service';

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

  protected document?: FullDocument;
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
        this.document = FullDocument.createEmpty(contentSchema);
        this.cdr.markForCheck();
      });
  }

  protected get readyToSave(): boolean {
    return this.docIdValid
      && this.pathValid
      && !!this.document;
  }

  protected saveDocument() {
    this.managementService.saveDocument(this.document!, this.contentSchema).match(
      document => {
        if (document.valid) {
          const ref = document.ref;
          const redirectPath = [ '/management', 'stores', ref.store, 'docs', ...ref.path, ref.docId ].filter(token => token);
          this.router.navigate(redirectPath);
        } else {
          this.document = document;
          this.cdr.markForCheck();
        }
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

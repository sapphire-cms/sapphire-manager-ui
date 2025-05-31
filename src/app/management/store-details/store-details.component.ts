import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import {ContentSchema, ContentType, DocumentInfo} from '@sapphire-cms/core';
import {STORE_DOCUMENTS_KEY} from '../store-documents.resolver';

@Component({
  selector: 'scms-store-details',
  standalone: false,
  templateUrl: './store-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDetailsComponent implements OnDestroy {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;
  protected docs: DocumentInfo[] = [];

  private readonly destroy$ = new Subject();

  constructor(protected readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.contentSchema = data[CONTENT_SCHEMA_KEY];
        this.docs = data[STORE_DOCUMENTS_KEY];
        this.cdr.markForCheck();
      })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  protected docLink(doc: DocumentInfo): string[] {
    return ['docs', ...doc.path, ...(doc.docId ? [doc.docId] : [])];
  }
}

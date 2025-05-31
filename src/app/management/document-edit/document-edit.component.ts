import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentSchema, ContentType, Document} from '@sapphire-cms/core';
import {map, Subject, takeUntil} from 'rxjs';
import {DOCUMENT_KEY} from '../document.resolver';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';

@Component({
  selector: 'scms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditComponent implements OnDestroy {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;
  protected document!: Document;

  private readonly destroy$ = new Subject();

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(map(data => data[DOCUMENT_KEY]), takeUntil(this.destroy$))
      .subscribe(document => {
        console.log('here');

        this.contentSchema = this.activatedRoute.parent?.parent?.snapshot.data[CONTENT_SCHEMA_KEY];
        this.document = document;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

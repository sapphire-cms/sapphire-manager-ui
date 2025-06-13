import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {forkJoin, map, mergeMap, Observable, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CONTENT_SCHEMA_KEY} from '../content-schema.resolver';
import {ContentSchema, ContentType, Document, DocumentInfo, DocumentReference} from '@sapphire-cms/core';
import {ManagementClient} from '../management-client.service';

@Component({
  selector: 'scms-store-details',
  standalone: false,
  templateUrl: './store-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDetailsComponent implements OnDestroy {
  protected readonly ContentType = ContentType;

  protected contentSchema!: ContentSchema;
  protected documents: DocumentInfo[] = [];

  private readonly destroy$ = new Subject();

  constructor(private readonly managementService: ManagementClient,
              private readonly activatedRoute: ActivatedRoute,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.data
      .pipe(
        map(data => {
          this.contentSchema = data[CONTENT_SCHEMA_KEY];
          return this.contentSchema.name;
        }),
        mergeMap(store => this.managementService.listDocuments(store)),
        takeUntil(this.destroy$)
      ).subscribe(documents => {
        this.documents = documents;
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

  protected deleteDoc(doc: DocumentInfo) {
    const deleteTasks: Observable<Document>[] = [];

    for (const variant of doc.variants) {
      const docRef = new DocumentReference(
        doc.store,
        doc.path,
        doc.docId,
        variant,
      );

      const task = this.managementService.deleteDocument(docRef);
      deleteTasks.push(task);
    }

    forkJoin(deleteTasks)
      .pipe(mergeMap(() => this.managementService.listDocuments(this.contentSchema.name)))
      .subscribe(documents => {
        this.documents = documents;
        this.cdr.markForCheck();
      });
  }
}

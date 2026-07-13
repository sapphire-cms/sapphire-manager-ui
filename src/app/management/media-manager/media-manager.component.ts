import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {ManagementClient} from '../management-client.service';
import {BranchInfo, DocumentInfo, isBranchInfo} from '@sapphire-cms/core';

@Component({
  selector: 'scms-media-manager',
  standalone: false,
  templateUrl: './media-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaManagerComponent implements OnDestroy {
  protected path: string[] = [];
  protected unexpectedServerError?: string;
  protected folders: BranchInfo[] = [];
  protected mediaDocs: DocumentInfo[] = [];

  private readonly destroy$ = new Subject();

  constructor(protected readonly activatedRoute: ActivatedRoute,
              private readonly managementClient: ManagementClient,
              private readonly router: Router,
              private readonly cdr: ChangeDetectorRef) {
    this.activatedRoute.url
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(url => {
        this.path = url.map(segment => segment.path);
        this.loadMedia(this.path);
      });
  }

  protected deleteMedia(mediaDoc: DocumentInfo) {
    this.managementClient.deleteMedia(mediaDoc.path, mediaDoc.docId!).match(
      () => {
        this.loadMedia(this.path);
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

  protected get uploadLink(): string[] {
    return [ '..', 'upload', ...this.path ];
  }

  protected navigateInManager(path: string[]) {
    if (path.length) {
      this.router.navigate(path, {
        relativeTo: this.activatedRoute.parent,
      });
    } else {
      this.router.navigate(['.'], {
        relativeTo: this.activatedRoute.parent,
      });
    }
  }

  private loadMedia(path: string[]): Promise<void> {
    return this.managementClient.listMedia(path).match(
      media => {
        this.folders = media.filter(m => isBranchInfo(m));
        this.mediaDocs = media.filter(m => !isBranchInfo(m)) as DocumentInfo[];
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

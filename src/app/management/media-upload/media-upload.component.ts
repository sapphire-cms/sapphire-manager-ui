import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ManagementClient, MediaMetadata} from '../management-client.service';
import {idFromString} from '@sapphire-cms/core';

@Component({
  selector: 'scms-media-upload',
  standalone: false,
  templateUrl: './media-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaUploadComponent implements OnDestroy {
  protected mediaId?: string;
  protected path: string[] = [];

  public readonly formControls: FormGroup;

  protected readonly media: FormControl;
  protected readonly title: FormControl;
  protected readonly alt: FormControl;
  protected readonly caption: FormControl;

  protected unexpectedServerError?: string;

  private readonly destroy$ = new Subject();

  constructor(protected readonly activatedRoute: ActivatedRoute,
              private readonly managementClient: ManagementClient,
              private readonly router: Router,
              private readonly cdr: ChangeDetectorRef,
              fb: FormBuilder) {
    this.media = fb.control<File | null>(null, [ Validators.required ]);
    this.title = fb.control(null);
    this.alt = fb.control(null);
    this.caption = fb.control(null);

    this.formControls = fb.group({
      media: this.media,
      title: this.title,
      alt: this.alt,
      caption: this.caption,
    });

    this.activatedRoute.url
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => this.path = url.map(segment => segment.path));
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.media.patchValue(file);
    this.media.updateValueAndValidity();
  }

  protected deleteSelectedFile() {
    this.media.patchValue(null);
    this.media.updateValueAndValidity();
  }

  protected async uploadMedia() {
    if (this.formControls.valid) {
      const meta: MediaMetadata = {
        mimeType: this.media.value?.type,
        title: this.title.value,
        alt: this.alt.value,
        caption: this.caption.value,
      }

      const mediaId = this.mediaId || idFromString(this.media.value?.name);

      return this.managementClient
        .uploadMedia(this.path, mediaId, meta, this.media.value)
        .match(
          () => {
            this.router.navigate(this.browseLink, {
              relativeTo: this.activatedRoute.parent,
            });
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
  }

  protected get browseLink(): string[] {
    return [ '..', 'browse', ...this.path ];
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

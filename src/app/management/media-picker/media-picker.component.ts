import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {BranchInfo, DocumentInfo, isBranchInfo} from '@sapphire-cms/core';
import {ManagementClient} from '../management-client.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'scms-media-picker',
  standalone: false,
  templateUrl: './media-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPickerComponent {

  @Input()
  public shown = false;

  @Output()
  public readonly selectedMedia = new EventEmitter<DocumentInfo>();

  @Output()
  public readonly close = new EventEmitter<void>();

  protected path: string[] = [];
  protected folders: BranchInfo[] = [];
  protected mediaDocs: DocumentInfo[] = [];
  protected unexpectedServerError?: string;

  constructor(private readonly managementClient: ManagementClient,
              private readonly cdr: ChangeDetectorRef) {
    this.loadMedia(this.path);
  }

  protected selectFolder(folder: BranchInfo) {
    this.navigate([ ...folder.path, folder.branchId ]);
  }

  protected navigate(path: string[]) {
    this.path = path;
    this.loadMedia(this.path);
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
}

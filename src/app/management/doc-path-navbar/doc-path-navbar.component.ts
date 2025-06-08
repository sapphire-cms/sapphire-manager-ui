import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ContentSchema} from '@sapphire-cms/core';

@Component({
  selector: 'scms-doc-path-navbar',
  standalone: false,
  templateUrl: './doc-path-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPathNavbarComponent {

  @Input()
  public contentSchema!: ContentSchema;

  @Input()
  public path: string[] = [];

  @Input()
  public docId?: string;

  protected get docLink(): string[] {
    return [ '/management', 'stores', this.contentSchema.name, 'docs', ...this.path, ...(this.docId ? [this.docId] : [])];
  }
}

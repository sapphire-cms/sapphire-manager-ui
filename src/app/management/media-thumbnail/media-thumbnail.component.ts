import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DocumentInfo} from '@sapphire-cms/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'scms-media-thumbnail',
  standalone: false,
  template: '<img [src]="src" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaThumbnailComponent {

  @Input()
  public mediaDoc!: DocumentInfo;

  protected get src(): string {
    const params: string[] = [];

    for (const token of this.mediaDoc.path) {
      params.push(`p=${token}`);
    }

    params.push(`i=${this.mediaDoc.docId}`);

    return environment.baseUrl + '/rest/management/media/thumbnail?' + params.join('&');
  }
}

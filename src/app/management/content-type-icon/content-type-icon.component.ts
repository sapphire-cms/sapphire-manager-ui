import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ContentType} from '@sapphire-cms/core';

@Component({
  selector: 'scms-content-type-icon',
  standalone: false,
  templateUrl: './content-type-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentTypeIconComponent {
  protected readonly ContentType = ContentType;

  @Input()
  public contentType!: ContentType;
}

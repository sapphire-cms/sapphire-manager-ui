import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ContentSchema, ContentType} from '@sapphire-cms/core';

@Component({
  selector: 'scms-store-list',
  standalone: false,
  templateUrl: './store-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreList {
  protected readonly ContentType = ContentType;

  @Input()
  public stores!: ContentSchema[];
}

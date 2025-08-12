import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FullDocument} from '../../forms/forms.types';
import {DocumentStatus} from '@sapphire-cms/core';

@Component({
  selector: 'scms-document-status-bar',
  standalone: false,
  templateUrl: './document-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentStatusBarComponent {

  @Input()
  public document!: FullDocument;
  protected readonly DocumentStatus = DocumentStatus;
}

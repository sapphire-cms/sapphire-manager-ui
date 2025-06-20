import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';

@Component({
  selector: 'scms-rich-text-input',
  standalone: false,
  templateUrl: './rich-text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextInputComponent extends AbstractInput<string> {
}

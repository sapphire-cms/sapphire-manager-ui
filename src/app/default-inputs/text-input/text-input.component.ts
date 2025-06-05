import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';

@Component({
  selector: 'scms-text-input',
  standalone: false,
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent extends AbstractInput<string> {
  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}

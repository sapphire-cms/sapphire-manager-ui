import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';

@Component({
  selector: 'scms-number-input',
  standalone: false,
  templateUrl: './number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputComponent extends AbstractInput<number> {
  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(Number(input.value));
  }
}

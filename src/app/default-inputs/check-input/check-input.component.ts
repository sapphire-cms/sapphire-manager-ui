import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';

@Component({
  selector: 'scms-check-input',
  standalone: false,
  templateUrl: './check-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInputComponent extends AbstractInput<boolean> {
  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.checked);
  }
}

import {ChangeDetectionStrategy, Component, effect, EventEmitter, input, InputSignal, Output} from '@angular/core';
import {idValidator, ValidationResult} from '@sapphire-cms/core';

@Component({
  selector: 'scms-doc-id-input',
  standalone: false,
  templateUrl: './doc-id-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocIdInputComponent {
  public readonly value: InputSignal<string | undefined> = input<string | undefined>(undefined);

  @Output()
  public readonly valueChange = new EventEmitter<string>();

  @Output()
  public readonly valid = new EventEmitter<boolean>(true);

  protected validationResult?: ValidationResult;

  constructor() {
    effect(() => {
      this.onChange(this.value());
    });
  }

  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onChange(input.value);
  }

  private onChange(input: string | undefined) {
    if (input) {
      this.validationResult = idValidator(input);
      this.valueChange.emit(input);
      this.valid.emit(this.validationResult.isValid);
    } else {
      this.validationResult = undefined;
      this.valueChange.emit(undefined);
      this.valid.emit(true);
    }
  }
}

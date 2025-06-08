import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  input,
  InputSignal,
  Output
} from '@angular/core';
import {idValidator, ValidationResult} from '@sapphire-cms/core';

@Component({
  selector: 'scms-doc-path-input',
  standalone: false,
  templateUrl: './doc-path-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPathInputComponent {
  public readonly value: InputSignal<string[]> = input<string[]>([]);

  @Output()
  public readonly valueChange = new EventEmitter<string[]>();

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
    const tokens = input.value.length ? input.value.split('/') : [];
    this.onChange(tokens);
  }

  private onChange(tokens: string[]) {
    const errors: string[] = [];

    for (const token of tokens) {
      const validationResult = idValidator(token);
      errors.push(...validationResult.errors);
    }

    this.validationResult = ValidationResult.invalid(...errors);

    this.valueChange.emit(tokens);
    this.valid.emit(this.validationResult.isValid);
  }
}

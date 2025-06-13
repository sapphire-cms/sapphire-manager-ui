import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  effect,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FieldSchema} from '../../../../../sapphire-cms/packages/core';
import {AbstractInput} from '../../inputs-base/abstract-input';
import {InputsRegistryService} from '../../inputs-base/inputs-registry.service';
import {PrimitiveValue} from '../forms.types';

@Component({
  selector: 'scms-simple-input',
  standalone: false,
  templateUrl: './simple-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleInputComponent implements OnInit {

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public value?: PrimitiveValue;

  public invalid = input<boolean>(false);

  @Output()
  public readonly valueChange = new EventEmitter<PrimitiveValue | undefined>();

  @ViewChild('input', { read: ViewContainerRef, static: true })
  private inputContainer!: ViewContainerRef;

  private inputComponent: ComponentRef<AbstractInput<any>> | undefined;

  constructor(private readonly registry: InputsRegistryService) {
    effect(() => {
      this.inputComponent!.setInput('invalid', this.invalid());
    });
  }

  ngOnInit(): void {
    let inputComponentFactory: Type<AbstractInput<any>> | undefined;
    inputComponentFactory = this.registry.getComponentFactory(this.fieldSchema.type.name);

    // TODO: remove this fallback later
    if (!inputComponentFactory) {
      inputComponentFactory = this.registry.getComponentFactory('text')!;
    }

    this.inputComponent = this.inputContainer.createComponent(inputComponentFactory!);
    this.inputComponent.setInput('params', this.fieldSchema.type.params);
    this.inputComponent.setInput('example', this.fieldSchema.example);

    const value = this.value != null
      ? typeof this.value === 'boolean'
        ? this.value
        : String(this.value)
      : undefined;
    this.inputComponent.setInput('value', value);

    this.inputComponent.instance.valueChange.subscribe(newValue => this.valueChange.emit(newValue));
  }
}

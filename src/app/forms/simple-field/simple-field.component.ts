import {
  ChangeDetectionStrategy,
  Component, ComponentRef, EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FieldSchema, ValidationResult} from '@sapphire-cms/core';
import {InputsRegistryService} from '../../inputs-base/inputs-registry.service';
import {AbstractInput} from '../../inputs-base/abstract-input';

@Component({
  selector: 'scms-simple-field',
  standalone: false,
  templateUrl: './simple-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFieldComponent<T extends string | number | boolean> implements OnInit, OnChanges {

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public fieldValue: T | undefined;

  @Input()
  public validationResult?: ValidationResult;

  @Output()
  public readonly fieldValueChange = new EventEmitter<T | undefined>();

  @ViewChild('input', { read: ViewContainerRef, static: true })
  private inputContainer!: ViewContainerRef;

  private inputComponent: ComponentRef<AbstractInput<any>> | undefined;

  constructor(private readonly registry: InputsRegistryService) {
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
    this.inputComponent.setInput('value', this.fieldValue);
    this.inputComponent.setInput('example', this.fieldSchema.example);

    this.inputComponent.instance.valueChange.subscribe(newValue => this.fieldValueChange.emit(newValue));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['validationResult']) {
      this.inputComponent?.setInput('invalid', this.validationResult?.errors?.length);
    }
  }
}

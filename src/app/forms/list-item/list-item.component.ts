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
  selector: 'scms-list-item',
  standalone: false,
  templateUrl: './list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent<T extends string | number | boolean> implements OnInit, OnChanges {

  @Input()
  public fieldSchema!: FieldSchema;

  @Input()
  public itemValue: T | undefined;

  @Input()
  public index!: number;

  @Input()
  public last!: boolean;

  @Input()
  public validationResult?: ValidationResult;

  @Output()
  public readonly itemValueChange = new EventEmitter<T | undefined>();

  @Output()
  public readonly moveUp = new EventEmitter<number>();

  @Output()
  public readonly moveDown = new EventEmitter<number>();

  @Output()
  public readonly delete = new EventEmitter<number>();

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
    this.inputComponent.setInput('value', this.itemValue);
    this.inputComponent.setInput('example', this.fieldSchema.example);

    this.inputComponent.instance.valueChange.subscribe(newValue => this.itemValueChange.emit(newValue));
  }

  protected onMoveUp() {
    this.moveUp.emit(this.index);
  }

  protected onMoveDown() {
    this.moveDown.emit(this.index);
  }

  protected onDelete() {
    this.delete.emit(this.index);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['validationResult']) {
      this.inputComponent?.setInput('invalid', this.validationResult?.errors?.length);
    }
  }
}

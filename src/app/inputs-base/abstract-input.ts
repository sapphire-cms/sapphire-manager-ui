import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractInput<T> {

  @Input()
  public params: any;

  @Input()
  public value: T | undefined;

  @Input()
  public example: T | undefined;

  @Input()
  public invalid = false;

  @Output()
  public readonly valueChange = new EventEmitter<T | undefined>();
}

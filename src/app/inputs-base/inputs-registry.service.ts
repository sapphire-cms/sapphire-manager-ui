import {Injectable, Type} from '@angular/core';
import {AbstractInput} from './abstract-input';

@Injectable({
  providedIn: 'root'
})
export class InputsRegistryService {
  private readonly registry = new Map<string, Type<AbstractInput<any>>>;

  public register(fieldType: string, componentFactory: Type<AbstractInput<any>>) {
    this.registry.set(fieldType, componentFactory);
  }

  public getComponentFactory(fieldType: string): Type<AbstractInput<any>> | undefined {
    return this.registry.get(fieldType);
  }
}

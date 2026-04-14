import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading = this._isLoading$.asObservable();

  public set loading(isLoading: boolean) {
    this._isLoading$.next(isLoading);
  }
}

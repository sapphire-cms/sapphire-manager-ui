import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {DocumentInfo} from '@sapphire-cms/core';
import {ManagementService} from './management.service';
import {Observable} from 'rxjs';

export const STORE_DOCUMENTS_KEY = 'storeDocuments';

@Injectable()
export class StoreDocumentsResolver implements Resolve<DocumentInfo[]> {
  constructor(private readonly managementService: ManagementService) {
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<DocumentInfo[]> {
    const store = route.paramMap.get('store')!;
    return this.managementService.listDocuments(store);
  }
}

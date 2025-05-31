import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Document, DocumentReference} from '@sapphire-cms/core';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ManagementService} from './management.service';

export const DOCUMENT_KEY = 'document';

@Injectable()
export class DocumentResolver implements Resolve<Document> {
  constructor(private readonly managementService: ManagementService) {
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<Document> {
    const store = route.paramMap.get('store')!;
    const path = route.url.map(seg => seg.path);
    const docPath = [store, ...path].join('/');
    const variant = route.queryParamMap.get('v');
    const ref = variant ? docPath + ':' + variant : docPath;
    const docRef = DocumentReference.parse(ref);

    return this.managementService.fetchDocument(docRef);
  }
}

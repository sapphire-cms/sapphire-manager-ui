import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DocumentReference} from '@sapphire-cms/core';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FullDocument} from '../forms/forms.types';
import {CONTENT_SCHEMA_KEY} from './content-schema.resolver';
import {ManagementService} from './management.service';

export const DOCUMENT_KEY = 'document';

@Injectable()
export class DocumentResolver implements Resolve<FullDocument> {
  constructor(private readonly managementService: ManagementService) {
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<FullDocument> {
    const store = route.paramMap.get('store')!;
    const path = route.url.map(seg => seg.path);
    const docPath = [store, ...path].join('/');
    const variant = route.queryParamMap.get('v');
    const ref = variant ? docPath + ':' + variant : docPath;

    const docRef = DocumentReference.parse(ref);
    const contentSchema = route.data[CONTENT_SCHEMA_KEY];

    return new Observable<FullDocument>(subscriber => {
      this.managementService.loadDocument(docRef, contentSchema).match(
        document => {
          subscriber.next(document);
          subscriber.complete();
        },
        err => {
          subscriber.error(err.message);
        },
        defect => {
          subscriber.error(defect);
        },
      );
    });
  }
}

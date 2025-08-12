import { ResolveFn } from '@angular/router';
import {DocumentReference} from '@sapphire-cms/core';

export const DOCUMENT_REFERENCE = 'document';

export const docRefResolver: ResolveFn<DocumentReference> = (route) => {
  const store = route.paramMap.get('store')!;
  const path = route.url.map(seg => seg.path);
  const docPath = [store, ...path].join('/');
  const variant = route.queryParamMap.get('v');
  const ref = variant ? docPath + ':' + variant : docPath;

  return DocumentReference.parse(ref);
};

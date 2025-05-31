import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ContentSchema} from '@sapphire-cms/core';
import {ManagementService} from './management.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

export const CONTENT_SCHEMA_KEY = 'contentSchema';

@Injectable()
export class ContentSchemaResolver implements Resolve<ContentSchema> {
  constructor(private readonly managementService: ManagementService) {
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<ContentSchema> {
    const store = route.paramMap.get('store')!;
    return this.managementService.getContentSchema(store);
  }
}

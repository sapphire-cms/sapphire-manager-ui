import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ContentSchema, DocumentInfo, DocumentReference, Document} from '@sapphire-cms/core';

@Injectable()
export class ManagementService {
  private static readonly server = 'http://0.0.0.0:8083';

  constructor(private http: HttpClient) {
  }

  public listStores(): Observable<ContentSchema[]> {
    return this.http.get<ContentSchema[]>(ManagementService.server + '/rest/management/stores');
  }

  public getContentSchema(store: string): Observable<ContentSchema> {
    return this.http.get<ContentSchema>(ManagementService.server + `/rest/management/stores/${store}`);
  }

  public listDocuments(store: string): Observable<DocumentInfo[]> {
    return this.http.get<DocumentInfo[]>(ManagementService.server + `/rest/management/actions/list/${store}`);
  }

  public fetchDocument(docRef: DocumentReference): Observable<Document> {
    const path = [ docRef.store, ...docRef.path, docRef.docId ].filter(token => token).join('/');
    return this.http.get<Document>(ManagementService.server + `/rest/management/docs/${path}`, {

    });
  }
}

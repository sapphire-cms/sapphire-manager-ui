import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {
  ContentSchema,
  Document,
  DocumentContent,
  DocumentInfo,
  DocumentReference,
  InvalidDocumentError
} from '@sapphire-cms/core';
import {Outcome} from 'defectless';
import {MissingDocumentError, UnexpectedServerError} from '../../utils/errors';

@Injectable()
export class ManagementClient {
  private static readonly server = 'http://0.0.0.0:8083';

  constructor(private http: HttpClient) {
  }

  public listStores(): Observable<ContentSchema[]> {
    return this.http.get<ContentSchema[]>(ManagementClient.server + '/rest/management/stores');
  }

  public getContentSchema(store: string): Observable<ContentSchema> {
    return this.http.get<ContentSchema>(ManagementClient.server + `/rest/management/stores/${store}`);
  }

  public listDocuments(store: string): Observable<DocumentInfo[]> {
    return this.http.get<DocumentInfo[]>(ManagementClient.server + `/rest/management/stores/${store}/list`);
  }

  public fetchDocument(docRef: DocumentReference): Outcome<Document, MissingDocumentError | UnexpectedServerError> {
    const docPath = [ ...docRef.path, docRef.docId ].filter(token => token).join('/');

    return Outcome.fromCallback((onSuccess, onFailure) => {
      this.http
        .get<Document>(ManagementClient.server + `/rest/management/stores/${docRef.store}/docs/${docPath}`)
        .pipe(catchError(err => {
          if (err.status === 404) {
            onFailure(new MissingDocumentError(err.error));
          } else {
            onFailure(new UnexpectedServerError(err.error));
          }

          return throwError(() => err);
        }))
        .subscribe(doc => onSuccess(doc));
    });
  }

  public putDocument(docRef: DocumentReference, content: DocumentContent): Outcome<Document, InvalidDocumentError | UnexpectedServerError> {
    const docPath = [ ...docRef.path, docRef.docId ].filter(token => token).join('/');

    return Outcome.fromCallback((onSuccess, onFailure) => {
      this.http
        .put<Document>(ManagementClient.server + `/rest/management/stores/${docRef.store}/docs/${docPath}`, content)
        .pipe(catchError(err => {
          if (err.status === 400) {
            onFailure(err.error);
          } else {
            onFailure(new UnexpectedServerError(err.error));
          }

          return throwError(() => err);
        }))
        .subscribe(doc => onSuccess(doc));
    });
  }

  public deleteDocument(docRef: DocumentReference): Observable<Document> {
    const docPath = [ ...docRef.path, docRef.docId ].filter(token => token).join('/');
    return this.http.delete<Document>(ManagementClient.server + `/rest/management/stores/${docRef.store}/docs/${docPath}`);
  }
}

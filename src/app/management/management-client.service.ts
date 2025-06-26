import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  constructor(private http: HttpClient) {
  }

  public listStores(): Observable<ContentSchema[]> {
    return this.http.get<ContentSchema[]>('/rest/management/stores');
  }

  public getContentSchema(store: string): Observable<ContentSchema> {
    return this.http.get<ContentSchema>(`/rest/management/stores/${store}`);
  }

  public listDocuments(store: string): Observable<DocumentInfo[]> {
    return this.http.get<DocumentInfo[]>(`/rest/management/stores/${store}/list`);
  }

  public fetchDocument(docRef: DocumentReference): Outcome<Document, MissingDocumentError | UnexpectedServerError> {
    return Outcome.fromCallback((onSuccess, onFailure) => {
      this.http
        .get<Document>(`/rest/management/stores/${docRef.store}/docs`, {
          params: ManagementClient.docRefToParams(docRef),
        })
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
    return Outcome.fromCallback((onSuccess, onFailure) => {
      this.http
        .put<Document>(`/rest/management/stores/${docRef.store}/docs`, content, {
          params: ManagementClient.docRefToParams(docRef),
        })
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
    return this.http.delete<Document>(`/rest/management/stores/${docRef.store}/docs`, {
      params: ManagementClient.docRefToParams(docRef),
    });
  }

  private static docRefToParams(docRef: DocumentReference): HttpParams {
    let params = new HttpParams();

    docRef.path.forEach(token => {
      params = params.append('p', token);
    });

    if (docRef.docId) {
      params = params.set('d', docRef.docId);
    }

    if (docRef.variant) {
      params = params.set('v', docRef.variant);
    }

    return params;
  }
}

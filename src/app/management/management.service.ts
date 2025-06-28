import {Injectable} from '@angular/core';
import {ManagementClient} from './management-client.service';
import {
  ContentSchema,
  ContentValidationResult,
  createHiddenCollectionSchema,
  Document,
  DocumentContent,
  DocumentReference,
  FieldSchema,
  FieldsValidationResult,
  InvalidDocumentError,
  matchError,
  ValidationResult
} from '@sapphire-cms/core';
import {failure, Outcome, Program, program, success} from 'defectless';
import {MissingDocumentError, UnexpectedServerError} from '../../utils/errors';
import {FullDocument, FullDocumentContent, PrimitiveValue} from '../forms/forms.types';

@Injectable()
export class ManagementService {
  constructor(private readonly managementClient: ManagementClient) {
  }

  public loadDocument(docRef: DocumentReference, schema: ContentSchema | FieldSchema): Outcome<FullDocument, MissingDocumentError | UnexpectedServerError> {
    return program(
      function* (): Program<FullDocument, MissingDocumentError | UnexpectedServerError> {
        const document: Document = yield this.managementClient.fetchDocument(docRef);
        const fullDocument = new FullDocument(
          new DocumentReference(document.store, document.path, document.id, document.variant),
          document.type,
          document.status,
          document.createdAt,
          document.lastModifiedAt,
          document.content as FullDocumentContent,
        );

        for (const fieldSchema of schema.fields) {
          if (fieldSchema.type.name === 'group' && fullDocument.content[fieldSchema.name]) {
            const groupDocRefs = fieldSchema.isList
              ? (fullDocument.content[fieldSchema.name] as string[])
              : [fullDocument.content[fieldSchema.name] as string];

            const groupDocs: FullDocument[] = [];

            for (const groupDocRef of groupDocRefs) {
              const ref = DocumentReference.parse(groupDocRef);
              const groupDoc: FullDocument = yield this.loadDocument(ref, fieldSchema);
              groupDocs.push(groupDoc);
            }

            if (fieldSchema.isList) {
              fullDocument.content[fieldSchema.name] = groupDocs;
            } else {
              fullDocument.content[fieldSchema.name] = groupDocs[0];
            }
          }
        }

        return fullDocument;
      },
      this,
    );
  }

  public saveDocument(document: FullDocument, contentSchema: ContentSchema): Outcome<FullDocument, UnexpectedServerError> {
    const docClone = document.clone();

    return program(
      function* (): Program<FullDocument, UnexpectedServerError> {
        for (const fieldSchema of contentSchema.fields) {
          if (fieldSchema.type.name === 'group' && docClone.content[fieldSchema.name]) {
            const hiddenCollectionSchema = createHiddenCollectionSchema(contentSchema, fieldSchema);

            if (fieldSchema.isList) {
              const groupDocs = docClone.content[fieldSchema.name] as FullDocument[];

              for (let i = 0; i < groupDocs.length; i++) {
                groupDocs[i] = yield this.saveDocument(groupDocs[i], hiddenCollectionSchema);
              }
            } else {
              const groupDoc = docClone.content[fieldSchema.name] as FullDocument;
              docClone.content[fieldSchema.name] = yield this.saveDocument(groupDoc, hiddenCollectionSchema);
            }
          }
        }

        const flatContent: DocumentContent = {};

        for (const fieldSchema of contentSchema.fields) {
          if (fieldSchema.type.name === 'group' && docClone.content[fieldSchema.name]) {
            if (fieldSchema.isList) {
              const groupDocs = docClone.content[fieldSchema.name] as FullDocument[];
              const refs: string[] = [];

              for (const groupDoc of groupDocs) {
                refs.push(groupDoc.ref.toString());
              }

              flatContent[fieldSchema.name] = refs;
            } else {
              flatContent[fieldSchema.name] = (docClone.content[fieldSchema.name] as FullDocument).ref.toString();
            }
          } else {
            flatContent[fieldSchema.name] = docClone.content[fieldSchema.name] as PrimitiveValue | PrimitiveValue[] | undefined;
          }
        }

        return this.managementClient
          .putDocument(docClone.ref, flatContent)
          .map((savedDoc) => {
            docClone.ref = new DocumentReference(savedDoc.store, savedDoc.path, savedDoc.id, savedDoc.variant);
            docClone.validation = undefined;
            return docClone;
          })
          .recover((err) => {
            return matchError(err, {
              InvalidDocumentError: (validationError) => {
                docClone.validation = ManagementService.deserializeContentValidation((validationError as InvalidDocumentError).validationResult);
                return success(docClone) as Outcome<FullDocument, UnexpectedServerError>;
              },
              _: (internalError) => {
                return failure(err as UnexpectedServerError) as Outcome<FullDocument, UnexpectedServerError>;
              }
            });
          });
      },
      this,
    );
  }

  /**
   * Forces reconstruction of object from JSON.
   */
  private static deserializeContentValidation(result: ContentValidationResult): ContentValidationResult {
    const fields: FieldsValidationResult<any> = {};

    for (const [fieldName, fieldResult] of Object.entries(result.fields) as [string, ValidationResult[]][]) {
      fields[fieldName] = fieldResult.map(validation => ValidationResult.invalid(...validation.errors));
    }

    return new ContentValidationResult(fields);
  }
}

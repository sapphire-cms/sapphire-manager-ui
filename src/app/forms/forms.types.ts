import {
  ContentSchema,
  ContentType,
  ContentValidationResult,
  createHiddenCollectionSchema,
  DocumentReference,
  FieldsValidationResult, FieldTypeSchema,
  ValidationResult,
} from '@sapphire-cms/core';
import {Clonable, Cloner} from '../../utils/clonable';

export type PrimitiveValue = boolean | number | string;
export type PrimitiveList<T extends PrimitiveValue = PrimitiveValue> = (T | undefined)[];

export type FullDocumentContent = Record<
  string,
  | PrimitiveValue
  | PrimitiveList
  | FullDocument
  | FullDocument[]
  | undefined
>;

export function emptySimpleValue(fieldType: FieldTypeSchema): PrimitiveValue {
  switch (fieldType.name) {
    case 'check':
      return false;
    case 'number':
      return 0;
    default:
      return '';
  }
}

const documentReferenceCloner: Cloner<DocumentReference> = (ref) => {
  return new DocumentReference(
    ref.store,
    [...ref.path],
    ref.docId,
    ref.variant,
  );
}

const validationResultCloner: Cloner<ValidationResult> = (validationResult) => {
  return ValidationResult.invalid(...validationResult.errors);
};

const contentValidationResultCloner: Cloner<ContentValidationResult> = (validation) => {
  const fields: FieldsValidationResult<any> = {};

  for (const [fieldName, fieldResult] of Object.entries(validation.fields) as [string, ValidationResult[]][]) {
    fields[fieldName] = fieldResult.map(validationResultCloner);
  }

  return new ContentValidationResult(fields);
}

export class FullDocument implements Clonable<FullDocument> {
  public static createEmpty(contentSchema: ContentSchema): FullDocument {
    const content: FullDocumentContent = {};

    for (const fieldSchema of contentSchema.fields) {
      content[fieldSchema.name] = fieldSchema.isList ? [] : undefined;

      if (fieldSchema.isList) {
        content[fieldSchema.name] = [];
      } else if (fieldSchema.type.name === 'group' && fieldSchema.required) {
        const groupFieldSchema = createHiddenCollectionSchema(contentSchema, fieldSchema);
        content[fieldSchema.name] = FullDocument.createEmpty(groupFieldSchema);
      } else {
        content[fieldSchema.name] = emptySimpleValue(fieldSchema.type);
      }
    }

    return new FullDocument(
      new DocumentReference(contentSchema.name, []),
      contentSchema.type,
      content,
    );
  }

  constructor(public ref: DocumentReference,
              public type: ContentType,
              public content: FullDocumentContent,
              public validation?: ContentValidationResult) {
  }

  public get valid(): boolean {
    if (!this.validation) {
      return true;
    }

    let groupsValid = true;

    for (const fieldValue of Object.values(this.content)) {
      if (fieldValue instanceof FullDocument) {
        groupsValid &&= fieldValue.valid;
      }

      if (!groupsValid) {
        break;
      }
    }

    return groupsValid && this.validation.isValid;
  }

  public clone(): FullDocument {
    const content: FullDocumentContent = {};

    for (const [fieldName, fieldValue] of Object.entries(this.content)) {
      let clonedValue: any;

      if (Array.isArray(fieldValue)) {
        clonedValue = fieldValue.map(item => item instanceof  FullDocument
          ? item.clone()
          : item);
      } else if (fieldValue instanceof FullDocument) {
        clonedValue = fieldValue.clone();
      } else {
        clonedValue = fieldValue;
      }

      content[fieldName] = clonedValue;
    }

    const validation = this.validation
      ? contentValidationResultCloner(this.validation)
      : undefined;

    return new FullDocument(
      documentReferenceCloner(this.ref),
      this.type,
      content,
      validation,
    );
  }
}

export interface EditableListItem<T> {
  id: string;
  value: T;
}

export class EditableList<T> {
  public readonly items: EditableListItem<T>[];

  constructor(sourceList: T[]) {
    this.items = [];

    for (let i = 0; i < sourceList.length; i++) {
      this.items.push({
        id: String(i),
        value: sourceList[i],
      });
    }
  }

  public set(index: number, value: T) {
    this.items[index].value = value;
  }

  public add(value: T) {
    this.items.push({
      id: String(this.items.length),
      value: value,
    });
  }

  public moveUp(index: number) {
    const copy = this.items[index - 1];
    this.items[index - 1] = this.items[index];
    this.items[index] = copy;
  }

  public moveDown(index: number) {
    const copy = this.items[index + 1];
    this.items[index + 1] = this.items[index];
    this.items[index] = copy;
  }

  public delete(index: number) {
    this.items.splice(index, 1);
  }

  public toArray(): T[] {
    return this.items.map(item => item.value);
  }
}

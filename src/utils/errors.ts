import {Throwable} from '@sapphire-cms/core';

export class UnexpectedServerError extends Throwable {
  public readonly _tag = 'UnexpectedServerError';

  public constructor(message: string) {
    super(message);
  }
}

export class MissingDocumentError extends Throwable {
  public readonly _tag = 'MissingDocumentError';

  public constructor(message: string) {
    super(message);
  }
}

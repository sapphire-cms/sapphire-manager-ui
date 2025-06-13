export abstract class Throwable extends Error {
  public abstract _tag: string;

  protected constructor(message: string, cause?: unknown) {
    super(message, { cause });
  }
}

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

export interface Clonable<T = any> {
  clone(): T;
}

export type Cloner<T = any> = (val: T) => T;

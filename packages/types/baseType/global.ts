export type TokenType = string;

export interface StringIndexable {
  [key: string]: any;
}
export interface NumberIndexable {
  [key: number]: any;
}
export type Indexable = StringIndexable & NumberIndexable;

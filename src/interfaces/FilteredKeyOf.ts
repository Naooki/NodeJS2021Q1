export type FilteredKeyOf<T, TK> = keyof Pick<
  T,
  { [K in keyof T]: T[K] extends TK ? K : never }[keyof T]
>;

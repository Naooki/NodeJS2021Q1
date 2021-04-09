type FilteredKeyOf<T, TK> = keyof Pick<
  T,
  { [K in keyof T]: T[K] extends TK ? K : never }[keyof T]
>;

export interface ListSearchParams<T, K> {
  key?: FilteredKeyOf<T, K>;
  value?: K;
  limit?: number;
}

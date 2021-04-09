import { FilteredKeyOf } from './FilteredKeyOf';

export interface SearchParams<T, K> {
  key?: FilteredKeyOf<T, K>;
  value?: K;
  limit?: number;
}

export interface DBRead<T> {
  find<K>(params: SearchParams<T, K>): Promise<T[]>;
  findOne(param: { [K in keyof T]?: T[K] }): Promise<T>;
}

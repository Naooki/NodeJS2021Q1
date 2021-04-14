import { ListSearchParams } from 'src/interfaces/ListSearchParams';

export interface DBRead<T> {
  find<K>(params: ListSearchParams<T, K>): Promise<T[]>;
  findOne(param: { [K in keyof T]?: T[K] }): Promise<T | null>;
}

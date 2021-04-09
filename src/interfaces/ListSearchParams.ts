import { FilteredKeyOf } from './FilteredKeyOf';

export interface ListSearchParams<T, K> {
  key?: FilteredKeyOf<T, K>;
  value?: K;
  limit?: number;
}

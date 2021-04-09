import { DBRead } from 'src/data-access/DBRead';
import { DBWrite } from 'src/data-access/DBWrite';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';

export abstract class BaseRepository<T> implements DBWrite<T>, DBRead<T> {
  protected readonly _collection: any;

  constructor(db: any, collectionName: string) {
    this._collection = db.collection(collectionName);
  }

  async create(item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, item: T): Promise<T | null> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async find<K>(param: ListSearchParams<T, K>): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(param: { [K in keyof T]?: T[K] }): Promise<T> {
    throw new Error('Method not implemented.');
  }
}

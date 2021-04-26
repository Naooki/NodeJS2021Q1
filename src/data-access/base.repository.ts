/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { DBRead } from 'src/data-access/DBRead';
import { DBWrite } from 'src/data-access/DBWrite';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';

export abstract class BaseRepository<T> implements DBWrite<T>, DBRead<T> {
  async create(item: Partial<T>, ...params: any): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async createMany(item: Partial<T>[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async find<K>(param?: ListSearchParams<T, K>): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(param: { [K in keyof T]?: T[K] }): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
}

import faker from 'faker';

import { BaseRepository } from './base.repository';
import { UserCreationAttributes, UserAttributes } from '../models/User';
import { ListSearchParams } from '../interfaces/ListSearchParams';

export class MockUserRepository extends BaseRepository<UserAttributes> {
  private _usersData: UserAttributes[] = [];

  async create(item: UserCreationAttributes) {
    const user = { ...item, id: faker.random.uuid(), isDeleted: false };
    this._usersData.push(user);
    return user;
  }

  async find<K>(
    params: ListSearchParams<UserAttributes, K>,
  ): Promise<UserAttributes[]> {
    return this.getAutoSuggestUsers<K>(params);
  }

  async findOne({ id, login }: { id?: string; login?: string }) {
    return this._usersData.find(
      (user) => user.id === id || user.login === login,
    ) as UserAttributes;
  }

  async update(id: string, item: UserCreationAttributes) {
    const user = this._usersData.find((user) => user.id === id);
    if (user) {
      Object.assign(user, item);
      return user;
    }
    throw new Error('NOT_FOUND');
  }

  async delete(id: string) {
    const user = this._usersData.find((user) => user.id === id);
    if (user) {
      user.isDeleted = true;
      return true;
    }
    return false;
  }

  private async getAutoSuggestUsers<K>({
    key,
    value,
    limit,
  }: ListSearchParams<UserAttributes, K>) {
    let result = [...this._usersData];

    if (key && value) {
      if (value) {
        if (typeof value === 'string' && key === 'login') {
          result = result.filter((user) => user[key].includes(value));
        }
        if (typeof value === 'number' && key === 'age') {
          result = result.filter((user) => user[key] === value);
        }
      }
      result = result.sort((a, b) => (a[key] < b[key] ? -1 : 1));
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }

  createMany(usersData: UserCreationAttributes[]): Promise<UserAttributes[]> {
    this._usersData = usersData.map((userData) => ({
      ...userData,
      id: faker.random.uuid(),
      isDeleted: false,
    }));
    return Promise.resolve(this._usersData);
  }
}

import * as faker from 'faker';

import { BaseRepository } from './BaseRepository';
import { User } from 'src/interfaces/User';
import { SearchParams } from 'src/interfaces/DBRead';

export class MockUserRepository extends BaseRepository<User> {
  private _usersData: User[];

  constructor() {
    super({ collection: () => {} }, 'mock-users');
    this._usersData = this.initMockUsers(100);
  }

  async create(item: User) {
    this._usersData.push(item);
    return item;
  }

  async find<K>(params: SearchParams<User, K>) {
    return this.getAutoSuggestUsers<K>(params);
  }

  async findOne({ id, login }: { id?: string; login?: string }) {
    return this._usersData.find(
      (user) => user.id === id || user.login === login,
    ) as User;
  }

  async update(id: string, item: User) {
    const user = this._usersData.find((user) => user.id === id);
    if (user) {
      Object.assign(user, item);
      return user;
    }
    return null;
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
  }: SearchParams<User, K>) {
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

  private initMockUsers(quantity: number) {
    return new Array(quantity).fill(null).map(() => ({
      id: faker.random.uuid(),
      login: faker.internet.userName(),
      password: faker.random.alphaNumeric(8),
      age: faker.random.number({ min: 4, max: 130 }),
      isDeleted: false,
    }));
  }
}

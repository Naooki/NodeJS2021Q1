import { inject, injectable } from 'inversify';
import faker from 'faker';

import { TOKENS } from 'src/infrastructure/tokens';
import { BaseRepository } from 'src/data-access/base.repository';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { UserAttributes, UserCreationAttributes } from 'src/models/User';

@injectable()
export class UserService {
  constructor(
    @inject(TOKENS.UserRepository)
    private repository: BaseRepository<UserAttributes>,
  ) {}

  async getUserById(id: string) {
    return this.repository.findOne({ id });
  }

  async getUserByLogin(login: string) {
    return this.repository.findOne({ login });
  }

  async getUsers({
    key,
    value,
    limit,
  }: ListSearchParams<UserAttributes, string>) {
    return this.repository.find({
      key: key || 'login',
      value,
      limit: limit || 99,
    });
  }

  async createUser({ login, password, age }: UserCreationAttributes) {
    const id = faker.random.uuid();
    return this.repository.create({ id, login, password, age });
  }

  async updateUser(id: string, userData: UserCreationAttributes) {
    return this.repository.update(id, userData);
  }

  async deleteUser(id: string) {
    return this.repository.delete(id);
  }

  async initDefaultUsers(quantity: number) {
    const usersData = new Array(100).fill(null).map(
      () =>
        ({
          id: faker.random.uuid(),
          login: faker.internet.userName(),
          password: faker.random.alphaNumeric(8),
          age: faker.random.number({ min: 4, max: 130 }),
        } as UserCreationAttributes),
    );
    return this.repository.createMany(usersData);
  }
}
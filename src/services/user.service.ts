import { inject, injectable } from 'inversify';
import faker from 'faker';

import { TOKENS } from 'src/infrastructure/tokens';
import { BaseRepository } from 'src/data-access/base.repository';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { UserAttributes, UserCreationAttributes } from 'src/models/User';
import { hash } from 'src/utils';

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
    const passwordHash = await hash(password);
    return this.repository.create({ login, password: passwordHash, age });
  }

  async updateUser(id: string, userData: UserCreationAttributes) {
    if (userData.password) {
      userData.password = await hash(userData.password);
    }
    return this.repository.update(id, userData);
  }

  async deleteUser(id: string) {
    return this.repository.delete(id);
  }

  async initDefaultUsers(quantity: number) {
    const promises = new Array(quantity)
      .fill(null)
      .map(() => this.initMockUser());
    const usersData = await Promise.all(promises);
    return this.repository.createMany(usersData);
  }

  private async initMockUser(): Promise<UserCreationAttributes> {
    const password = await hash(faker.random.alphaNumeric(8));
    return {
      login: faker.internet.userName(),
      password,
      age: faker.random.number({ min: 4, max: 130 }),
    };
  }
}

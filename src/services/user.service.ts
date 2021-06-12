import { inject, injectable } from 'inversify';

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

  async createManyUsers(users: UserCreationAttributes[]) {
    const promises = users.map((user) => this.hashUserPassword(user));

    const usersData = await Promise.all(promises);
    return this.repository.createMany(usersData);
  }

  private async hashUserPassword(
    userData: UserCreationAttributes,
  ): Promise<UserCreationAttributes> {
    return {
      ...userData,
      password: await hash(userData.password),
    };
  }
}

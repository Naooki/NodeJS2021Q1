import faker from 'faker';
import { UserRepository } from 'src/data-access/UserRepository';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { User, UserAttributes, UserCreationAttributes } from 'src/models/User';

export class UserService {
  constructor(private repository: UserRepository) {}

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
    const userExists = await this.getUserByLogin(login).then((user) => !!user);

    if (userExists) {
      throw new Error('USER_EXISTS');
    } else {
      const user = new User({ login, password, age });
      return this.repository.create(user.get());
    }
  }

  async updateUser(id: string, userData: UserCreationAttributes) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error('NOT_FOUND');
    }

    const loginIsTaken = userData.login
      ? await this.checkLoginIsTakenOnUpdate(id, userData)
      : await Promise.resolve(false);

    if (loginIsTaken) {
      throw new Error('USER_EXISTS');
    }
    Object.assign(user, userData);
    return this.repository.update(id, user);
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
    return this.repository.createInTransaction(usersData);
  }

  private async checkLoginIsTakenOnUpdate(
    id: string,
    userData: UserCreationAttributes,
  ) {
    return this.getUserByLogin(userData.login).then(
      (user) => user && user.id !== id,
    );
  }
}

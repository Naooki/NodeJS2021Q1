import faker from 'faker';

import { BaseRepository } from 'src/data-access/BaseRepository';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { User, UserInputDTO } from 'src/interfaces/User';

export class UserService {
  constructor(private repository: BaseRepository<User>) {}

  async getUserById(id: string) {
    return this.repository.findOne({ id });
  }

  async getUserByLogin(login: string) {
    return this.repository.findOne({ login });
  }

  async getUsers({ key, value, limit }: ListSearchParams<User, string>) {
    return this.repository.find({
      key: key || 'login',
      value,
      limit: limit || 99,
    });
  }

  async createUser(userData: UserInputDTO) {
    const userExists = await this.getUserByLogin(userData.login).then(
      (user) => !!user,
    );

    if (userExists) {
      throw new Error('USER_EXISTS');
    } else {
      const user: User = {
        id: faker.random.uuid(),
        isDeleted: false,
        ...userData,
      };
      return this.repository.create(user);
    }
  }

  async updateUser(id: string, userData: UserInputDTO) {
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

    return this.repository.update(id, { ...user, ...userData });
  }

  async deleteUser(id: string) {
    return this.repository.delete(id);
  }

  private async checkLoginIsTakenOnUpdate(id: string, userData: UserInputDTO) {
    return this.getUserByLogin(userData.login).then(
      (user) => user && user.id !== id,
    );
  }
}

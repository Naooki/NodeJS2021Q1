import { BaseRepository } from 'src/data-access/BaseRepository';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { User } from 'src/domain/User';
import { UserBase } from 'src/domain/UserBase';

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

  async createUser({ login, password, age }: UserBase) {
    const userExists = await this.getUserByLogin(login).then((user) => !!user);

    if (userExists) {
      throw new Error('USER_EXISTS');
    } else {
      const user = new User(login, password, age);
      return this.repository.create(user);
    }
  }

  async updateUser(id: string, userData: UserBase) {
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

  private async checkLoginIsTakenOnUpdate(id: string, userData: UserBase) {
    return this.getUserByLogin(userData.login).then(
      (user) => user && user.id !== id,
    );
  }
}

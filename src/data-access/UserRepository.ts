import { Sequelize, Transaction } from 'sequelize/types';

import { User, UserCreationAttributes, UserAttributes } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<UserAttributes> {
  constructor(private dbConn: Sequelize) {
    super();
  }

  async create(item: UserCreationAttributes, transaction?: Transaction) {
    return User.create(item, { transaction }).then((user) => user.get());
  }

  async findOne({ id, login }: Partial<Pick<UserAttributes, 'id' | 'login'>>) {
    let promise: Promise<User | null> = Promise.resolve(null);

    if (id) {
      promise = User.findByPk(id);
    }
    if (login) {
      promise = User.findOne({ where: { login } });
    }
    return promise.then((user) => (user ? user.get() : null));
  }

  async createMany(items: UserCreationAttributes[]) {
    return this.dbConn.transaction(async (transaction) => {
      const opearations = items.map((item) => this.create(item, transaction));
      return Promise.all(opearations);
    });
  }
}

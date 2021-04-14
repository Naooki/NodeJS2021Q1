import { Op, Order, Sequelize, Transaction, WhereOptions } from 'sequelize';
import { ListSearchParams } from '../interfaces/ListSearchParams';

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

  async find<K>(
    params: ListSearchParams<UserAttributes, K>,
  ): Promise<UserAttributes[]> {
    return this.getAutoSuggestUsers<K>(params);
  }

  private async getAutoSuggestUsers<K>({
    key,
    value,
    limit,
  }: ListSearchParams<UserAttributes, K>) {
    const where: WhereOptions<UserAttributes> = {};
    let order: Order = [];

    if (key && value) {
      if (value) {
        if (typeof value === 'string' && key === 'login') {
          where[key] = { [Op.substring]: value };
        }
        if (typeof value === 'number' && key === 'age') {
          where[key] = value;
        }
        order = [[key, 'ASC']];
      }
    }

    return User.findAll({ where, order, limit }).then((users) =>
      users.map((user) => user.get()),
    );
  }
}

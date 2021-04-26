import { inject, injectable } from 'inversify';
import { Op, Order, Transaction, WhereOptions } from 'sequelize';

import { TOKENS } from 'src/infrastructure/tokens';
import { ListSearchParams } from 'src/interfaces/ListSearchParams';
import { User, UserCreationAttributes, UserAttributes } from 'src/models/User';
import { BaseRepository } from './base.repository';

@injectable()
export class UserRepository extends BaseRepository<UserAttributes> {
  constructor(@inject(TOKENS.UserModel) private Model: typeof User) {
    super();
  }

  async create(item: UserCreationAttributes, transaction?: Transaction) {
    return this.Model.create(item, { transaction })
      .then((user) => user.get())
      .catch((e) => {
        if (e.name === 'SequelizeUniqueConstraintError') {
          throw new Error('USER_EXISTS');
        }
        throw e;
      });
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
    if (!this.Model.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.Model.sequelize.transaction(async (transaction) => {
      const opearations = items.map((item) => this.create(item, transaction));
      return Promise.all(opearations);
    });
  }

  async find<K>(
    params: ListSearchParams<UserAttributes, K>,
  ): Promise<UserAttributes[]> {
    return this.getAutoSuggestUsers<K>(params);
  }

  async update(id: string, item: UserCreationAttributes) {
    if (!this.Model.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.Model.sequelize.transaction(async () => {
      const user = await this.Model.findByPk(id);

      if (!user) {
        throw new Error('NOT_FOUND');
      }

      return user
        .update(item)
        .then((user) => user.get())
        .catch((e) => {
          if (e.name === 'SequelizeUniqueConstraintError') {
            throw new Error('USER_EXISTS');
          }
          throw e;
        });
    });
  }

  async delete(id: string) {
    const user = await this.Model.findByPk(id);

    if (!user) {
      throw new Error('NOT_FOUND');
    }

    return user
      .update({ isDeleted: true })
      .then((user) => !user.get().isDeleted);
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

    return this.Model.findAll({ where, order, limit }).then((users) =>
      users.map((user) => user.get()),
    );
  }
}

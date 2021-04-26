import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';

import { TOKENS } from 'src/infrastructure/tokens';
import {
  Group,
  GroupCreationAttributes,
  GroupAttributes,
} from 'src/models/Group';
import { BaseRepository } from './base.repository';

@injectable()
export class GroupRepository extends BaseRepository<GroupAttributes> {
  constructor(@inject(TOKENS.GroupModel) private Model: typeof Group) {
    super();
  }

  async create(item: GroupCreationAttributes, transaction?: Transaction) {
    return this.Model.create(item, { transaction })
      .then((group) => group.get())
      .catch((e) => {
        if (e.name === 'SequelizeUniqueConstraintError') {
          throw new Error('ALREADY_EXISTS');
        }
        throw e;
      });
  }

  async findOne({ id }: Partial<Pick<GroupAttributes, 'id'>>) {
    let promise: Promise<Group | null> = Promise.resolve(null);

    if (id) {
      promise = Group.findByPk(id);
    }
    return promise.then((group) => (group ? group.get() : null));
  }

  async createMany(items: GroupCreationAttributes[]) {
    if (!this.Model.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.Model.sequelize.transaction(async (transaction) => {
      const opearations = items.map((item) => this.create(item, transaction));
      return Promise.all(opearations);
    });
  }

  async find(): Promise<GroupAttributes[]> {
    return this.Model.findAll().then((groups) =>
      groups.map((item) => item.get()),
    );
  }

  async update(id: string, itemData: GroupCreationAttributes) {
    if (!this.Model.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.Model.sequelize.transaction(async () => {
      const item = await this.Model.findByPk(id);

      if (!item) {
        throw new Error('NOT_FOUND');
      }

      return item
        .update(itemData)
        .then((item) => item.get())
        .catch((e) => {
          if (e.name === 'SequelizeUniqueConstraintError') {
            throw new Error('ALREADY_EXISTS');
          }
          throw e;
        });
    });
  }

  async delete(id: string) {
    const item = await this.Model.findByPk(id);

    if (!item) {
      throw new Error('NOT_FOUND');
    }

    return item.destroy().then(() => true);
  }
}

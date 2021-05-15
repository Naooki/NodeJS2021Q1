import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';

import { TOKENS } from 'src/infrastructure/tokens';
import {
  Group,
  GroupCreationAttributes,
  GroupAttributes,
} from 'src/models/Group';
import { User } from 'src/models/User';
import { BaseRepository } from './base.repository';

@injectable()
export class GroupRepository extends BaseRepository<GroupAttributes> {
  constructor(
    @inject(TOKENS.GroupModel) private GroupModel: typeof Group,
    @inject(TOKENS.UserModel) private UserModel: typeof User,
  ) {
    super();
  }

  async create(item: GroupCreationAttributes, transaction?: Transaction) {
    return this.GroupModel.create(item, { transaction })
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
    if (!this.GroupModel.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.GroupModel.sequelize.transaction(async (transaction) => {
      const opearations = items.map((item) => this.create(item, transaction));
      return Promise.all(opearations);
    });
  }

  async find(): Promise<GroupAttributes[]> {
    return this.GroupModel.findAll().then((groups) =>
      groups.map((item) => item.get()),
    );
  }

  async update(id: string, itemData: GroupCreationAttributes) {
    if (!this.GroupModel.sequelize) {
      throw new Error('NO_CONNECTION');
    }
    return this.GroupModel.sequelize.transaction(async () => {
      const item = await this.GroupModel.findByPk(id);

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

  async addUsersToGroup(groupId: string, userIds: string[]) {
    if (!this.GroupModel.sequelize) {
      throw new Error('NO_CONNECTION');
    }

    return this.GroupModel.sequelize.transaction(async () => {
      const group = await this.GroupModel.findByPk(groupId);

      if (!group) {
        throw new Error('NOT_FOUND');
      }
      const users = await this.UserModel.findAll({
        where: {
          id: userIds,
        },
      });

      return group.addUsers(users);
    });
  }

  async delete(id: string) {
    const item = await this.GroupModel.findByPk(id);

    if (!item) {
      throw new Error('NOT_FOUND');
    }

    return item.destroy().then(() => true);
  }
}

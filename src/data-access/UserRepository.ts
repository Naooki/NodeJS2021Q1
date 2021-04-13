import { Sequelize, Transaction } from 'sequelize/types';

import {
  User,
  UserCreationAttributes,
  UserAttributes,
  InitUserModel,
} from 'src/models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<UserAttributes> {
  constructor(private dbConn: Sequelize) {
    super();
    InitUserModel(dbConn);
  }

  async create(item: UserCreationAttributes, transaction?: Transaction) {
    return User.create(item, { transaction });
  }

  async createInTransaction(items: UserCreationAttributes[]) {
    return this.dbConn.transaction(async (transaction) => {
      const opearations = items.map((item) => this.create(item, transaction));
      return Promise.all(opearations);
    });
  }

  initData() {
    console.log('init users data...');
    console.log('Success');
  }
}

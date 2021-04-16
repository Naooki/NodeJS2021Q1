import { injectable } from 'inversify';
import { Sequelize } from 'sequelize';

import { InitUserModel } from '../models/User';

@injectable()
export class PersistenceManager {
  private _conn?: Sequelize;

  async connect() {
    // TODO: CONFIG + LOG
    const sequelize = new Sequelize('CONNECTION_STRING', { pool: { max: 3 } });
    InitUserModel(sequelize);
    this._conn = await sequelize.sync();
    return this._conn;
  }

  async close() {
    // TODO: LOG
    if (this._conn) {
      return this._conn.close();
    }
    return Promise.resolve();
  }
}

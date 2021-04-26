import { injectable } from 'inversify';
import { Sequelize } from 'sequelize';

@injectable()
export class PersistenceManager {
  private readonly _conn: Sequelize;

  get connection() {
    return this._conn;
  }

  constructor() {
    // TODO: CONFIG + LOG
    this._conn = new Sequelize(process.env.PG_CONN_STR as string, {
      pool: { max: 3 },
    });
  }

  async connect(force?: boolean) {
    return this._conn.sync({ force });
  }

  async close() {
    // TODO: LOG
    if (this._conn) {
      return this._conn.close();
    }
    return Promise.resolve();
  }
}

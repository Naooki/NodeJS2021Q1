import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize';

import { Config } from 'src/infrastructure/config';
import { TOKENS } from 'src/infrastructure/tokens';

@injectable()
export class PersistenceManager {
  private readonly _conn: Sequelize;

  get connection() {
    return this._conn;
  }

  constructor(@inject(TOKENS.Config) private config: Config) {
    // TODO: LOG
    this._conn = new Sequelize(this.config.pgConnStr, {
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

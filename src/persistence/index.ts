import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize';

import { TOKENS } from 'src/infrastructure/tokens';
import { Config } from 'src/infrastructure/config';
import { Logger } from 'src/infrastructure/logger';

@injectable()
export class PersistenceManager {
  private readonly _conn: Sequelize;

  get connection() {
    return this._conn;
  }

  constructor(
    @inject(TOKENS.Config) private config: Config,
    @inject(TOKENS.Logger) private logger: Logger,
  ) {
    this.logger.log({
      level: 'info',
      message: `Connecting to: ${this.config.pgConnStr}`,
    });
    this._conn = new Sequelize(this.config.pgConnStr, {
      pool: { max: 3 },
      logging:
        this.config.logLevel === 'debug'
          ? (message) => this.logger.log({ level: 'debug', message })
          : false,
    });
  }

  async connect(force?: boolean) {
    return this._conn.sync({ force });
  }

  async close() {
    this.logger.log({ level: 'info', message: 'Closing the DB connection...' });
    if (this._conn) {
      return this._conn.close();
    }
    return Promise.resolve();
  }
}

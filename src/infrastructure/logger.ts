import { inject, injectable } from 'inversify';
import winston from 'winston';

import { TOKENS } from './tokens';
import { Config } from './config';

@injectable()
export class Logger {
  private readonly _logger = winston.createLogger({
    level: this.config.logLevel,
    transports: [new winston.transports.Console()],
  });

  constructor(@inject(TOKENS.Config) private config: Config) {}

  log(params: { level: string; message: any }) {
    this._logger.log(params);
  }
}

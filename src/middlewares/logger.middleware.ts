import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { TOKENS } from 'src/infrastructure/tokens';
import { Logger } from 'src/infrastructure/logger';

@injectable()
export class LoggerMiddleware extends BaseMiddleware {
  constructor(@inject(TOKENS.Logger) private readonly _logger: Logger) {
    super();
  }

  handler(req: Request, res: Response, next: NextFunction) {
    const message = {
      type: 'Request',
      path: req.path,
      queryParams: req.query,
      body: req.body,
    };

    this._logger.log({ level: 'info', message });
    next();
  }
}

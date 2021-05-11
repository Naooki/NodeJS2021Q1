import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { TOKENS } from 'src/infrastructure/tokens';
import { Logger } from 'src/infrastructure/logger';

@injectable()
export class UnhandledErrorMiddleware {
  constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

  handler(error: unknown, req: Request, res: Response, next: NextFunction) {
    this.logger.log({ level: 'error', message: error });
    res.status(500);
    res.json({ path: req.path, message: 'Something went wrong' });
    next();
  }
}

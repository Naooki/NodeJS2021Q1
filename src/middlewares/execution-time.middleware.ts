import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import onHeaders from 'on-headers';

import { TOKENS } from 'src/infrastructure/tokens';
import { Logger } from 'src/infrastructure/logger';

@injectable()
export class ExecutionTimeMiddleware {
  constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

  handler(req: Request, res: Response, next: NextFunction) {
    const startAt = process.hrtime();

    onHeaders(res, () => {
      const diff = process.hrtime(startAt);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;
      this.logger.log({
        level: 'info',
        message: `Executed in: ${time.toFixed(2)}ms`,
      });
    });

    next();
  }
}

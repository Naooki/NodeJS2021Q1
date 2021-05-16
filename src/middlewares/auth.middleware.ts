import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { TOKENS } from 'src/infrastructure/tokens';
import { Logger } from 'src/infrastructure/logger';
import { AuthService } from 'src/services/auth.service';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(
    @inject(TOKENS.Logger) private readonly logger: Logger,
    @inject(TOKENS.AuthService) private readonly authService: AuthService,
  ) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    let message = 'Authenticated';
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        await this.authService.verifyToken(token);
        next();
      } catch {
        message = 'Forbidden';
        res.status(403);
        res.json({
          path: req.path,
          message,
        });
      }
    } else {
      message = 'Unauthorized';
      res.status(401);
      res.json({
        path: req.path,
        message,
      });
    }
    this.logger.log({
      level: 'debug',
      message: {
        name: 'auth.middleware',
        args: { token },
        msg: message,
      },
    });
  }
}

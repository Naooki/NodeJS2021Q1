import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';

import { AuthLoginAttributes } from 'src/interfaces/AuthLoginAttributes';
import { TOKENS } from 'src/infrastructure/tokens';
import { Logger } from 'src/infrastructure/logger';
import { AuthService } from 'src/services/auth.service';
import { AjvValidatMiddleware } from 'src/middlewares/ajv-validate.middleware';
import { loginSchema } from './schemas';

@controller('/auth', AjvValidatMiddleware.getMiddleware(loginSchema))
export class AuthController {
  constructor(
    @inject(TOKENS.AuthService) private readonly authService: AuthService,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  @httpPost('/login')
  async login(req: Request, res: Response, next: NextFunction) {
    const credentials = req.body as AuthLoginAttributes;

    try {
      const token = await this.authService.login(credentials);
      res.status(200);
      res.json(token);
    } catch (e) {
      const message = 'Invalid user credentials';
      if (e.message === 'access-denied') {
        res.status(403);
        res.json({
          path: req.path,
          message,
        });
      } else {
        next(e);
        return;
      }

      this.logger.log({
        level: 'info',
        message: {
          name: 'login',
          args: { credentials },
          msg: message,
        },
      });
    }
  }
}

import { Request, Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';

import { TOKENS } from 'src/infrastructure/tokens';

@controller('', TOKENS.AuthMiddleware)
export class StatusController {
  @httpGet('/')
  getUsers(req: Request, res: Response) {
    res.status(200);
    res.json({
      status: 'OK',
      environment: process.env.APP_ENV,
      app_version: process.env.npm_package_version,
    });
  }
}

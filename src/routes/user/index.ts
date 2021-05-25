import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';

import { TOKENS } from 'src/infrastructure/tokens';
import { UserCreationAttributes } from 'src/models/User';
import { Logger } from 'src/infrastructure/logger';
import { UserService } from 'src/services/user.service';
import { AjvValidatMiddleware } from 'src/middlewares/ajv-validate.middleware';
import { createUserSchema, updateUserSchema } from './schemas';

@controller('/user')
export class UserController {
  constructor(
    @inject(TOKENS.UserService) private readonly userService: UserService,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  @httpGet('/')
  async getUsers(req: Request, res: Response) {
    const params: { value?: string; limit?: number } = {
      value: req.query.loginSubstring as string,
      limit: +(req.query.limit as string),
    };

    const result = await this.userService.getUsers(params);
    res.status(200);
    res.json(result);
  }

  @httpGet('/:id')
  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (user) {
      res.status(200);
      res.json(user);
    } else {
      const message = 'User not found.';

      res.status(404);
      res.json({ path: req.path, message });
      this.logger.log({
        level: 'info',
        message: {
          name: 'getUser',
          args: { id },
          msg: message,
        },
      });
    }
  }

  @httpPost('/', AjvValidatMiddleware.getMiddleware(createUserSchema))
  async createUser(req: Request, res: Response, next: NextFunction) {
    const userData = req.body as UserCreationAttributes;

    try {
      const user = await this.userService.createUser(userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'USER_EXISTS':
          message = 'User with this login already exists.';
          res.status(400);
          res.json({
            path: req.path,
            message,
          });
          break;
        default:
          next(e);
          return;
      }

      this.logger.log({
        level: 'info',
        message: {
          name: 'createUser',
          args: { userData },
          msg: message,
        },
      });
    }
  }

  @httpPut('/:id', AjvValidatMiddleware.getMiddleware(updateUserSchema))
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userData = req.body;

    try {
      const user = await this.userService.updateUser(id, userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'NOT_FOUND':
          message = 'User not found.';
          res.status(404);
          res.json({ path: req.path, message });
          break;
        case 'USER_EXISTS':
          message = 'User with this login already exists.';
          res.status(400);
          res.json({
            path: req.path,
            message,
          });
          break;
        default:
          next(e);
          return;
      }

      this.logger.log({
        level: 'info',
        message: {
          name: 'updateUser',
          args: { id },
          msg: message,
        },
      });
    }
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.userService.deleteUser(id);
      res.status(200);
      res.json({
        statusCode: 200,
      });
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'NOT_FOUND':
          message = 'User not found.';
          res.status(404);
          res.json({ path: req.path, message });
          break;
        default:
          next(e);
          return;
      }

      this.logger.log({
        level: 'info',
        message: {
          name: 'deleteUser',
          args: { id },
          msg: message,
        },
      });
    }
  }
}

import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from 'inversify-express-utils';
import { Request, Response } from 'express';

import { TOKENS } from 'src/infrastructure/tokens';
import { UserCreationAttributes } from 'src/models/User';
import { UserService } from 'src/services/user.service';
import { AjvValidatMiddleware } from 'src/middlewares/ajv-validate.middleware';
import { createUserSchema, patchUserSchema } from './schemas';

@controller('/user')
export class UserController {
  constructor(@inject(TOKENS.UserService) private userService: UserService) {}

  @httpGet('/')
  async getUsers(req: Request, res: Response) {
    const params: { value?: string; limit?: number } = {
      value: req.query.loginSubstring as string,
      limit: +(req.query.limit as string),
    };

    try {
      const result = await this.userService.getUsers(params);
      res.status(200);
      res.json(result);
    } catch (e) {
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpGet('/:id')
  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.getUserById(id);

      if (user) {
        res.status(200);
        res.json(user);
      } else {
        res.status(404);
        res.json({ path: req.path, message: 'User not found.' });
      }
    } catch (e) {
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpPost('/create', AjvValidatMiddleware.getMiddleware(createUserSchema))
  async createUser(req: Request, res: Response) {
    const userData = req.body as UserCreationAttributes;

    try {
      const user = await this.userService.createUser(userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      if (e.message === 'USER_EXISTS') {
        res.status(400);
        res.json({
          path: req.path,
          message: 'User with this login already exists.',
        });
        return;
      }
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpPatch('/:id', AjvValidatMiddleware.getMiddleware(patchUserSchema))
  async patchUser(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body;

    try {
      const user = await this.userService.updateUser(id, userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      switch (e.message) {
        case 'NOT_FOUND':
          res.status(404);
          res.json({ path: req.path, message: 'User not found.' });
          break;
        case 'USER_EXISTS':
          res.status(400);
          res.json({
            path: req.path,
            message: 'User with this login already exists.',
          });
          break;
        default:
          res.status(500);
          res.json({ path: req.path, message: 'Something went wrong' });
      }
    }
  }

  @httpDelete('/:id')
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.userService.deleteUser(id);
      res.status(200);
      res.json({
        statusCode: 200,
      });
    } catch (e) {
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }
}

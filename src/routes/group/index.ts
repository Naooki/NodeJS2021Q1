import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';

import { TOKENS } from 'src/infrastructure/tokens';
import { GroupCreationAttributes } from 'src/models/Group';
import { AjvValidatMiddleware } from 'src/middlewares/ajv-validate.middleware';
import {
  addUsersToGroupSchema,
  createGroupSchema,
  updateGroupSchema,
} from './schemas';
import { GroupService } from 'src/services/group.service';
import { Logger } from 'src/infrastructure/logger';

@controller('/group', TOKENS.AuthMiddleware)
export class GroupController {
  constructor(
    @inject(TOKENS.GroupService) private groupService: GroupService,
    @inject(TOKENS.Logger) private logger: Logger,
  ) {}

  @httpGet('/')
  async getGroups(req: Request, res: Response) {
    const result = await this.groupService.getAllGroups();
    res.status(200);
    res.json(result);
  }

  @httpGet('/:id')
  async getGroup(req: Request, res: Response) {
    const { id } = req.params;
    const group = await this.groupService.getGroupById(id);

    if (group) {
      res.status(200);
      res.json(group);
    } else {
      const message = 'Group not found.';

      res.status(404);
      res.json({ path: req.path, message });
      this.logger.log({
        level: 'info',
        message: {
          name: 'getGroupById',
          args: { id },
          msg: message,
        },
      });
    }
  }

  @httpPost('/', AjvValidatMiddleware.getMiddleware(createGroupSchema))
  async createGroup(req: Request, res: Response, next: NextFunction) {
    const groupData = req.body as GroupCreationAttributes;

    try {
      const group = await this.groupService.createGroup(groupData);
      res.status(200);
      res.json(group);
    } catch (e) {
      if (e.message === 'ALREADY_EXISTS') {
        const message = 'Group with this name already exists.';

        res.status(400);
        res.json({
          path: req.path,
          message,
        });
        this.logger.log({
          level: 'info',
          message: {
            name: 'createGroup',
            args: { groupData },
            msg: message,
          },
        });
        return;
      }
      next(e);
    }
  }

  @httpPut('/:id', AjvValidatMiddleware.getMiddleware(updateGroupSchema))
  async updateGroup(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const groupData = req.body;

    try {
      const group = await this.groupService.updateGroup(id, groupData);
      res.status(200);
      res.json(group);
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'NOT_FOUND':
          message = 'Group not found.';
          res.status(404);
          res.json({ path: req.path, message });
          break;
        case 'ALREADY_EXISTS':
          message = 'Group with this login already exists.';
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
          name: 'updateGroup',
          args: { groupData },
          msg: message,
        },
      });
    }
  }

  @httpPatch('/:id', AjvValidatMiddleware.getMiddleware(addUsersToGroupSchema))
  async addUsersToGroup(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userIds = req.body;

    try {
      const group = await this.groupService.addUsersToGroup(id, userIds);
      res.status(200);
      res.json(group);
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'NOT_FOUND':
          message = 'Group not found.';
          res.status(404);
          res.json({ path: req.path, message });
          break;
        case 'USER_NOT_FOUND':
          message = 'User not found.';
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
          name: 'addUsersToGroup',
          args: { userIds },
          msg: message,
        },
      });
    }
  }

  @httpDelete('/:id')
  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.groupService.deleteGroup(id);
      res.status(200);
      res.json({
        statusCode: 200,
      });
    } catch (e) {
      let message: string;
      switch (e.message) {
        case 'NOT_FOUND':
          message = 'Group not found.';
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
          name: 'deleteGroup',
          args: { id },
          msg: message,
        },
      });
    }
  }
}

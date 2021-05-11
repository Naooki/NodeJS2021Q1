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

@controller('/group')
export class GroupController {
  constructor(
    @inject(TOKENS.GroupService) private groupService: GroupService,
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
      res.status(404);
      res.json({ path: req.path, message: 'Group not found.' });
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
        res.status(400);
        res.json({
          path: req.path,
          message: 'Group with this name already exists.',
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
      switch (e.message) {
        case 'NOT_FOUND':
          res.status(404);
          res.json({ path: req.path, message: 'Group not found.' });
          break;
        case 'ALREADY_EXISTS':
          res.status(400);
          res.json({
            path: req.path,
            message: 'Group with this login already exists.',
          });
          break;
        default:
          next(e);
      }
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
      switch (e.message) {
        case 'NOT_FOUND':
          res.status(404);
          res.json({ path: req.path, message: 'Group not found.' });
          break;
        case 'USER_NOT_FOUND':
          res.status(400);
          res.json({
            path: req.path,
            message: 'User not found.',
          });
          break;
        default:
          next(e);
      }
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
      if (e.message === 'NOT_FOUND') {
        res.status(404);
        res.json({ path: req.path, message: 'Group not found.' });
        return;
      }
      next(e);
    }
  }
}

import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { Request, Response } from 'express';

import { TOKENS } from 'src/infrastructure/tokens';
import { GroupCreationAttributes } from 'src/models/Group';
import { AjvValidatMiddleware } from 'src/middlewares/ajv-validate.middleware';
import { createGroupSchema, updateGroupSchema } from './schemas';
import { GroupService } from 'src/services/group.service';

@controller('/group')
export class GroupController {
  constructor(
    @inject(TOKENS.GroupService) private groupService: GroupService,
  ) {}

  @httpGet('/')
  async getGroups(req: Request, res: Response) {
    try {
      const result = await this.groupService.getAllGroups();
      res.status(200);
      res.json(result);
    } catch (e) {
      res.status(500);
      console.log(e);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpGet('/:id')
  async getGroup(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const group = await this.groupService.getGroupById(id);

      if (group) {
        res.status(200);
        res.json(group);
      } else {
        res.status(404);
        res.json({ path: req.path, message: 'Group not found.' });
      }
    } catch (e) {
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpPost('/', AjvValidatMiddleware.getMiddleware(createGroupSchema))
  async createGroup(req: Request, res: Response) {
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
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }

  @httpPut('/:id', AjvValidatMiddleware.getMiddleware(updateGroupSchema))
  async updateGroup(req: Request, res: Response) {
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
          res.status(500);
          res.json({ path: req.path, message: 'Something went wrong' });
      }
    }
  }

  @httpDelete('/:id')
  async deleteGroup(req: Request, res: Response) {
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
      res.status(500);
      res.json({ path: req.path, message: 'Something went wrong' });
    }
  }
}

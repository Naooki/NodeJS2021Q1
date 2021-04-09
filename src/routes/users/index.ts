import { Router, Request, Response } from 'express';
import Ajv from 'ajv';

import { User } from 'src/interfaces/User';
import { UserService } from 'src/services/user.service';
import { MockUserRepository } from 'src/data-access/MockUserRepository';

import { createUserSchema, patchUserSchema } from './schemas';

const router = Router();

const userRepository = new MockUserRepository();
const userService = new UserService(userRepository);

const ajv = new Ajv();
const createUserValidate = ajv.compile(createUserSchema);
const patchUserValidate = ajv.compile(patchUserSchema);

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  let user: User;

  try {
    user = await userService.getUserById(id);

    if (user) {
      res.status(200);
      res.json(user);
    } else {
      res.status(404);
      res.json({ path: req.path, message: 'User not found.' });
    }
  } catch (e) {
    res.status(400);
    res.json({ path: req.path, message: 'User not found.' });
  }
});

router.post('/create', async (req: Request, res: Response) => {
  const userData = req.body;

  if (createUserValidate(userData)) {
    try {
      const user = await userService.createUser(userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      res.status(400);
      res.json({
        path: req.path,
        message: 'User with this login already exists.',
      });
    }
  } else {
    res.status(400);
    res.json(createUserValidate.errors);
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;

  if (patchUserValidate(req.body)) {
    try {
      const user = await userService.updateUser(id, userData);
      res.status(200);
      res.json(user);
    } catch (e) {
      switch (e.type) {
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
      }
    }
  } else {
    res.status(400);
    res.json(patchUserValidate.errors);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.status(200);
    res.json({
      statusCode: 200,
    });
  } catch (e) {
    res.status(400);
    res.json({ path: req.path, message: 'Something went wrong' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  const params: { value?: string; limit?: number } = {
    value: req.query.loginSubstring as string,
    limit: +(req.query.limit as string),
  };

  try {
    const result = await userService.getUsers(params);
    res.status(200);
    res.json(result);
  } catch (e) {
    res.status(400);
    res.json({ path: req.path, message: 'Something went wrong' });
  }
});

export { router as usersRoutes };

import { Router, Request, Response } from 'express';
import * as faker from 'faker';

import { User } from './User';
import { initMockUsers } from './utils';

const router = Router();

const usersData = initMockUsers(10);

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = usersData.find((user) => user.id === id);

  if (user) {
    res.status(200);
    res.json(user);
  } else {
    res.status(404);
    res.json({ path: req.path, message: 'User not found.' });
  }
});

router.post('/create', (req: Request, res: Response) => {
  // validate
  const body = req.body;

  const user: User = {
    id: faker.random.uuid(),
    isDeleted: false,
    ...body,
  };

  usersData.push(user);

  res.status(200);
  res.json(user);
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = usersData.find((user) => user.id === id);

  if (user) {
    // validate
    const { login, password, age } = req.body;
    user.login = login || user.login;
    user.password = password || user.password;
    user.age = age || user.age;

    res.status(200);
    res.json(user);
  } else {
    res.status(404);
    res.json({ path: req.path, message: 'User not found.' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = usersData.find((user) => user.id === id);

  if (user) {
    user.isDeleted = true;
    res.status(200);
    res.json(user);
  } else {
    res.status(404);
    res.json({ path: req.path, message: 'User not found.' });
  }
});

router.get('/', (req: Request, res: Response) => {
  const { loginSubstring = '', limit = 99 } = req.query;
  const result = getAutoSuggestUsers(loginSubstring as string, limit as number);
  res.status(200);
  res.json(result);
});

function getAutoSuggestUsers(loginSubstring: string, limit: number) {
  let result = [...usersData];

  if (loginSubstring) {
    result = result.filter((user) => user.login.includes(loginSubstring));
  }
  result = result.sort((a, b) => (a.login < b.login ? -1 : 1)).slice(0, +limit);

  return result;
}

export { router as usersRoutes };

import express, { Router } from 'express';

import { statusRoutes } from './routes/status';
import { usersRoutes } from './routes/users';

const app = express();

app.use(express.json());

const routes: { [key: string]: Router } = {
  '': statusRoutes,
  'users': usersRoutes,
};

Object.keys(routes).forEach((key: string) => {
  app.use(`/${key}`, routes[key]);
});

app.listen(3000, () => console.log('Server is listening on port 3000!'));

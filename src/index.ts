import express, { Router } from 'express';

import { statusRoutes } from './routes/status';

const app = express();

const routes: { [key: string]: Router } = {
  '': statusRoutes,
};

Object.keys(routes).forEach((key: string) => {
  app.use(`/${key}`, routes[key]);
});

app.listen(3000, () => console.log('Server is listening on port 3000!'));

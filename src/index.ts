import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';

import { initContainer } from './infrastructure/inversify.config';
import './routes/status';
import './routes/user';

initContainer().then((container) => {
  const server = new InversifyExpressServer(container);

  server
    .setConfig((app) => app.use(express.json()))
    .build()
    .listen(3000, () => console.log('Server is listening on port 3000!'));
});

import 'reflect-metadata';
import {
  InversifyExpressServer,
  BaseMiddleware,
} from 'inversify-express-utils';
import express from 'express';

import { initContainer } from './infrastructure/inversify.config';
import { TOKENS } from './infrastructure/tokens';
import './routes/status';
import './routes/user';
import './routes/group';

initContainer().then((container) => {
  const server = new InversifyExpressServer(container);

  server
    .setConfig((app) => {
      app.use(express.json());
      [TOKENS.LoggerMiddleware]
        .map((token) => container.get<BaseMiddleware>(token))
        .map((mw) => mw.handler.bind(mw))
        .forEach((handler) => app.use(handler));
    })
    .setErrorConfig((app) => {
      [TOKENS.ValidationErrorMiddleware]
        .map((token) => container.get<BaseMiddleware>(token))
        .map((mw) => mw.handler.bind(mw))
        .forEach((handler) => app.use(handler));
    })
    .build()
    .listen(3000, () => console.log('Server is listening on port 3000!'));
});

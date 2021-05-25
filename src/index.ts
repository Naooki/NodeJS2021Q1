import 'reflect-metadata';
import {
  InversifyExpressServer,
  BaseMiddleware,
} from 'inversify-express-utils';
import express from 'express';

import { initContainer } from './infrastructure/inversify.config';
import { TOKENS } from './infrastructure/tokens';
import { Logger } from './infrastructure/logger';
import './routes/status';
import './routes/user';
import './routes/group';

initContainer().then((container) => {
  const server = new InversifyExpressServer(container);

  const logger = container.get<Logger>(TOKENS.Logger);
  setupUnhandledRejectionListener(logger);
  setupUncaughtExceptionListener(logger);

  server
    .setConfig((app) => {
      app.use(express.json());
      [TOKENS.LoggerMiddleware, TOKENS.ExecutionTimeMiddleware]
        .map((token) => container.get<BaseMiddleware>(token))
        .map((mw) => mw.handler.bind(mw))
        .forEach((handler) => app.use(handler));
    })
    .setErrorConfig((app) => {
      [TOKENS.ValidationErrorMiddleware, TOKENS.UnhandledErrorMiddleware]
        .map((token) => container.get<BaseMiddleware>(token))
        .map((mw) => mw.handler.bind(mw))
        .forEach((handler) => app.use(handler));
    })
    .build()
    .listen(3000, () => console.log('Server is listening on port 3000!'));
});

function setupUnhandledRejectionListener(logger: Logger) {
  process.on('unhandledRejection', (reason) =>
    logger.log({
      level: 'error',
      message: `Unhandled promise rejection: ${reason}`,
    }),
  );
}

function setupUncaughtExceptionListener(logger: Logger) {
  process.on('uncaughtException', (err) =>
    logger.log({
      level: 'error',
      message: `Unhandled exception: ${err}`,
    }),
  );
}

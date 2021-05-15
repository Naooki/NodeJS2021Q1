import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';

import { initContainer } from './infrastructure/inversify.config';
import { TOKENS } from './infrastructure/tokens';
import { ValidationErrorMiddleware } from './middlewares/validation-errors.middleware';
import './routes/status';
import './routes/user';
import './routes/group';

initContainer().then((container) => {
  const server = new InversifyExpressServer(container);

  server
    .setConfig((app) => app.use(express.json()))
    .setErrorConfig((app) =>
      app.use(
        container.get<ValidationErrorMiddleware>(
          TOKENS.ValidationErrorMiddleware,
        ).handler,
      ),
    )
    .build()
    .listen(3000, () => console.log('Server is listening on port 3000!'));
});

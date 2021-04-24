import 'reflect-metadata';

import { UserService } from './services/user.service';
import { initContainer } from './infrastructure/inversify.config';
import { TOKENS } from './infrastructure/tokens';
import { PersistenceManager } from './persistence';

initContainer(true).then(async (container) => {
  const userService = container.get<UserService>(TOKENS.UserService);
  await userService.initDefaultUsers(100);
  const persistanceManager = container.get<PersistenceManager>(
    TOKENS.PersistenceManager,
  );
  await persistanceManager.close();
});

import { Container } from 'inversify';

import { TOKENS } from './tokens';
import { UserService } from 'src/services/user.service';
import { MockUserRepository } from 'src/data-access/mock-user.repository';
import { UserRepository } from 'src/data-access/user.repository';
import { PersistenceManager } from 'src/persistence';
import { ValidationErrorMiddleware } from 'src/middlewares/validation-errors.middleware';

export async function initContainer(persistanceConnectForce?: boolean) {
  const container = new Container({
    skipBaseClassChecks: true,
    defaultScope: 'Singleton',
  });

  container.bind(TOKENS.PersistenceManager).to(PersistenceManager);
  container
    .bind(TOKENS.ValidationErrorMiddleware)
    .to(ValidationErrorMiddleware);
  container.bind(TOKENS.UserService).to(UserService);

  const persistance = container.get<PersistenceManager>(
    TOKENS.PersistenceManager,
  );
  const conn = await persistance.connect(persistanceConnectForce);

  container.bind(TOKENS.Persistence).toConstantValue(conn);

  const UserRepo = process.env.MOCK_USERS_DB
    ? MockUserRepository
    : UserRepository;
  container.bind(TOKENS.UserRepository).to(UserRepo);

  return container;
}

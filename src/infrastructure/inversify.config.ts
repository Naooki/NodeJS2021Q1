import { Container } from 'inversify';

import { TOKENS } from './tokens';
import { UserService } from 'src/services/user.service';
import { BaseRepository } from 'src/data-access/BaseRepository';
import { UserAttributes } from 'src/models/User';
import { MockUserRepository } from 'src/data-access/MockUserRepository';
import { UserRepository } from 'src/data-access/UserRepository';
import { PersistenceManager } from 'src/persistence';

export async function initContainer(persistanceConnectForce?: boolean) {
  const container = new Container();

  container.bind(PersistenceManager).toSelf().inSingletonScope();

  const persistance = container.get(PersistenceManager);
  const conn = await persistance.connect(persistanceConnectForce);

  container.bind(TOKENS.Persistence).toConstantValue(conn);
  container.bind<UserService>(TOKENS.UserService).to(UserService);

  const UserRepo = process.env.MOCK_USERS_DB
    ? MockUserRepository
    : UserRepository;
  container
    .bind<BaseRepository<UserAttributes>>(TOKENS.UserRepository)
    .to(UserRepo);

  return container;
}

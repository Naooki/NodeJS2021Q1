import { Container } from 'inversify';

import { TOKENS } from './tokens';
import { Config } from './config';
import { UserService } from 'src/services/user.service';
import { GroupService } from 'src/services/group.service';
import { MockUserRepository } from 'src/data-access/mock-user.repository';
import { UserRepository } from 'src/data-access/user.repository';
import { GroupRepository } from 'src/data-access/group.repository';
import { PersistenceManager } from 'src/persistence';
import { ValidationErrorMiddleware } from 'src/middlewares/validation-errors.middleware';

import { InitUserModel } from 'src/models/User';
import { InitGroupModel } from 'src/models/Group';
import { InitUserGroupModel } from 'src/models/UserGroup';

export async function initContainer(persistanceConnectForce?: boolean) {
  const container = new Container({
    skipBaseClassChecks: true,
    defaultScope: 'Singleton',
  });

  container.bind(TOKENS.Config).to(Config);
  container.bind(TOKENS.PersistenceManager).to(PersistenceManager);
  container
    .bind(TOKENS.ValidationErrorMiddleware)
    .to(ValidationErrorMiddleware);
  container.bind(TOKENS.UserService).to(UserService);
  container.bind(TOKENS.GroupService).to(GroupService);

  // persistance and models
  const persistance = container.get<PersistenceManager>(
    TOKENS.PersistenceManager,
  );
  const conn = persistance.connection;
  container.bind(TOKENS.UserModel).toConstantValue(InitUserModel(conn));
  container.bind(TOKENS.GroupModel).toConstantValue(InitGroupModel(conn));
  InitUserGroupModel(conn);
  await persistance.connect(persistanceConnectForce);
  // ----------------------

  const UserRepo = process.env.MOCK_USERS_DB
    ? MockUserRepository
    : UserRepository;
  container.bind(TOKENS.UserRepository).to(UserRepo);
  container.bind(TOKENS.GroupRepository).to(GroupRepository);

  return container;
}

import 'reflect-metadata';
import faker from 'faker';

import { UserCreationAttributes } from './models/User';
import { UserService } from './services/user.service';
import { GroupCreationAttributes, Permission } from './models/Group';
import { GroupService } from './services/group.service';
import { initContainer } from './infrastructure/inversify.config';
import { TOKENS } from './infrastructure/tokens';
import { PersistenceManager } from './persistence';

initContainer(true).then(async (container) => {
  const userService = container.get<UserService>(TOKENS.UserService);
  const groupService = container.get<GroupService>(TOKENS.GroupService);

  const mockUsers = initMockUsersData(100);
  mockUsers.push({
    login: 'admin',
    password: 'T3st_4dm1n',
    age: 42,
  });
  const mockGroups = initMockGroupsData(5);

  await userService.createManyUsers(mockUsers);
  await groupService.createManyGroups(mockGroups);

  const persistanceManager = container.get<PersistenceManager>(
    TOKENS.PersistenceManager,
  );
  await persistanceManager.close();
});

function initMockUsersData(quantity: number): UserCreationAttributes[] {
  return new Array(quantity).fill(null).map(() => ({
    login: faker.internet.userName(),
    password: faker.random.alphaNumeric(8),
    age: faker.random.number({ min: 4, max: 130 }),
  }));
}

function initMockGroupsData(quantity: number): GroupCreationAttributes[] {
  return new Array(quantity).fill(null).map(
    () =>
      ({
        name: faker.name.jobDescriptor(),
        permissions: [faker.random.arrayElement(Object.values(Permission))],
      } as GroupCreationAttributes),
  );
}

import { inject, injectable } from 'inversify';
import faker from 'faker';

import { TOKENS } from 'src/infrastructure/tokens';
import { BaseRepository } from 'src/data-access/base.repository';
import {
  GroupAttributes,
  GroupCreationAttributes,
  Permission,
} from 'src/models/Group';

@injectable()
export class GroupService {
  constructor(
    @inject(TOKENS.GroupRepository)
    private repository: BaseRepository<GroupAttributes>,
  ) {}

  async getGroupById(id: string) {
    return this.repository.findOne({ id });
  }

  async getAllGroups() {
    return this.repository.find();
  }

  async createGroup({ name, permissions }: GroupCreationAttributes) {
    return this.repository.create({ name, permissions });
  }

  async updateGroup(id: string, groupData: GroupCreationAttributes) {
    return this.repository.update(id, groupData);
  }

  async deleteGroup(id: string) {
    return this.repository.delete(id);
  }

  async initDefaultGroups(quantity: number) {
    const usersData = new Array(quantity).fill(null).map(
      () =>
        ({
          name: faker.name.jobDescriptor(),
          permissions: [faker.random.arrayElement(Object.values(Permission))],
        } as GroupCreationAttributes),
    );
    return this.repository.createMany(usersData);
  }
}

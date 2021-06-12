import { inject, injectable } from 'inversify';

import { TOKENS } from 'src/infrastructure/tokens';
import { GroupRepository } from 'src/data-access/group.repository';
import { GroupAttributes, GroupCreationAttributes } from 'src/models/Group';

@injectable()
export class GroupService {
  constructor(
    @inject(TOKENS.GroupRepository)
    private repository: GroupRepository,
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

  async updateGroup(id: string, groupData: GroupAttributes) {
    return this.repository.update(id, groupData);
  }

  async deleteGroup(id: string) {
    return this.repository.delete(id);
  }

  async addUsersToGroup(id: string, userIds: string[]) {
    return this.repository.addUsersToGroup(id, userIds);
  }

  async createManyGroups(groups: GroupCreationAttributes[]) {
    return this.repository.createMany(groups);
  }
}

import { DataTypes, Model, Sequelize } from 'sequelize';

import { Group } from './Group';
import { User } from './User';

export interface UserGroupAttributes {
  id: string;
  userId: string;
  groupId: string;
}

export class UserGroup extends Model<
  UserGroupAttributes,
  UserGroupAttributes
> {}

export const InitUserGroupModel = (sequelize: Sequelize) => {
  UserGroup.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.UUID,
        references: {
          model: Group,
          key: 'id',
        },
      },
    },
    { sequelize },
  );

  User.belongsToMany(Group, { through: UserGroup });
  Group.belongsToMany(User, { through: UserGroup });
  return UserGroup;
};

import { DataTypes, Model, Sequelize } from 'sequelize';

import { Group } from './Group';
import { User } from './User';

export interface UserGroupAttributes {
  id: string;
  UserId: string;
  GroupId: string;
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
      UserId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
        },
      },
      GroupId: {
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

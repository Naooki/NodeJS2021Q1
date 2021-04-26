import { DataTypes, Model, Sequelize } from 'sequelize';

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export interface GroupAttributes {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface GroupCreationAttributes extends Omit<GroupAttributes, 'id'> {}

export class Group extends Model<GroupAttributes, GroupCreationAttributes> {}

export const InitGroupModel = (sequelize: Sequelize) =>
  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        unique: true,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(Permission))),
        defaultValue: [],
      },
    },
    { sequelize },
  );

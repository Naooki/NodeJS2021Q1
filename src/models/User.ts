import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, 'isDeleted' | 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {}

export const InitUserModel = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      login: {
        type: DataTypes.TEXT,
        unique: true,
      },
      password: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize },
  );

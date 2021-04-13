import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'isDeleted'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {}

export const InitUserModel = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      login: DataTypes.TEXT,
      password: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize },
  );
